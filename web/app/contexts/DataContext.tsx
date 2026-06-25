"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/API/api";
import { API_ENDPOINTS } from "../constants/routes";

interface DataContextType {
    dashboardData: any;
    isLoading: boolean;
    error: string | null;
    isFallback: boolean;
    refreshData: () => Promise<void>;
}

const CACHE_KEY = "dashboard_cache";
const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFallback, setIsFallback] = useState<boolean>(false);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!forceRefresh) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                setDashboardData(JSON.parse(cached));
                setIsLoading(false);
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        setIsFallback(false);

        try {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.CHARTS);
            const data = response.data;

            setDashboardData(data);
            setIsFallback(false);
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (err: any) {
            // Falha na API: usa o dataset de fallback estático (não é cacheado,
            // para que a próxima tentativa volte a buscar a API real).
            try {
                const { resolveFallback } = await import("../mocks/fallback");
                const fallback = resolveFallback(API_ENDPOINTS.DASHBOARD.CHARTS);
                if (fallback) {
                    setDashboardData(fallback);
                    setIsFallback(true);
                    setError(null);
                    return;
                }
            } catch {
                // ignora e cai no erro normal
            }
            setError("Falha ao carregar indicadores de mercado.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refreshData = () => fetchData(true);

    return (
        <DataContext.Provider value={{ dashboardData, isLoading, error, isFallback, refreshData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useDashboard deve ser utilizado dentro de um DataProvider");
    return context;
}
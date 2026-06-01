"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/API/api";
import { API_ENDPOINTS } from "../constants/routes";

interface DataContextType {
    dashboardData: any;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const CACHE_KEY = "dashboard_cache";
const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.CHARTS);
            const data = response.data;

            setDashboardData(data);
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (err: any) {
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
        <DataContext.Provider value={{ dashboardData, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useDashboard deve ser utilizado dentro de um DataProvider");
    return context;
}
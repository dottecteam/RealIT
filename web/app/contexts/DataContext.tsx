"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/API/api";

interface DataContextType {
    dashboardData: any;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (dashboardData) return;

        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/data/dashboard-charts");
            setDashboardData(response.data);
        } catch (err: any) {
            console.error("Erro ao carregar dados globais:", err);
            setError(err.response?.data?.error || "Falha ao carregar indicadores de mercado.");
        } finally {
            setIsLoading(false);
        }
    }, [dashboardData]);

    const refreshData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get("/data/dashboard-charts");
            setDashboardData(response.data);
        } catch (err: any) {
            setError("Erro ao atualizar dados.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DataContext.Provider value={{ dashboardData, isLoading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDashboard deve ser utilizado dentro de um DataProvider");
    }
    return context;
}
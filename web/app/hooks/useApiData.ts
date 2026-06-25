"use client";

import { useState, useEffect } from "react";
import { api } from "../services/API/api";
import { AxiosError } from "axios";

export function useApiData<T>(url: string, params?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setIsFallback(false);

      const currentParams = serializedParams ? JSON.parse(serializedParams) : undefined;

      try {
        const response = await api.get<T>(url, {
          params: currentParams,
          signal: controller.signal,
        });

        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.name === "CanceledError") {
          return;
        }

        // Falha na API: tenta servir os dados de fallback estáticos antes de
        // exibir erro, para que os dashboards continuem com conteúdo.
        try {
          const { resolveFallback } = await import("../mocks/fallback");
          const fallback = resolveFallback(url, currentParams);
          if (fallback !== null) {
            setData(fallback as T);
            setIsFallback(true);
            setError(null);
            return;
          }
        } catch {
          // ignora erro ao carregar o módulo de fallback e cai no erro normal
        }

        const axiosError = err as AxiosError<{ error?: string; mensagem?: string }>;
        const apiErrorMessage = axiosError.response?.data?.error || axiosError.response?.data?.mensagem;

        setError(apiErrorMessage || axiosError.message || "Erro ao carregar dados.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, serializedParams]);

  return { data, isLoading, error, isFallback, setData };
}

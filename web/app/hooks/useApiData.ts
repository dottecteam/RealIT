import { useState, useEffect } from "react";
import { api } from "../services/API/api";

export function useApiData<T>(url: string, params?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await api.get(url, {
          params,
          signal: controller.signal
        });
        setData(response.data);
        setError(null);
      } catch (err: any) {
        if (err.name !== "CanceledError") {
          setError(err.message || "Erro ao carregar dados.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url, serializedParams]);

  return { data, isLoading, error, setData };
}
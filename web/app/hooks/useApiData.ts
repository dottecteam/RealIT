"use client";

import { useState, useEffect } from "react";
import { api } from "../services/API/api";

const memoryCache: Record<string, any> = {};
const CACHE_DURATION = 10 * 60 * 1000; 

export function useApiData<T>(endpoint: string, params: Record<string, any> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (memoryCache[fetchKey]) {
        setData(memoryCache[fetchKey]);
        setIsLoading(false);
        return;
      }

      const storedData = sessionStorage.getItem(fetchKey);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const now = Date.now();
        
        if (now - parsed.timestamp < CACHE_DURATION) {
          memoryCache[fetchKey] = parsed.data;
          setData(parsed.data);
          setIsLoading(false);
          return;
        } else {
          sessionStorage.removeItem(fetchKey);
        }
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await api.get(endpoint, { params });
        
        if (isMounted) {
          const responseData = response.data;
          
          memoryCache[fetchKey] = responseData;
          sessionStorage.setItem(fetchKey, JSON.stringify({
            data: responseData,
            timestamp: Date.now()
          }));

          setData(responseData);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.error || "Erro ao carregar os dados");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchKey]);

  return { data, isLoading, error };
}
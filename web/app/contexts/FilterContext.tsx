"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useDebounce } from "../hooks/useDebounce";

export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export type Indicador = string;

export interface ServerFilters {
  mesAno: string | null;
  mesInicio: string | null;
  mesFim: string | null;
  indicador: Indicador[] | null;
}

export interface ClientFilters {
  scoreRC: [number, number];
  scoreIE: [number, number];
  regioesOcultas: Regiao[];
}

export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

const DEFAULT_SERVER: ServerFilters = {
  mesAno: null,
  mesInicio: null,
  mesFim: null,
  indicador: null,
};
const DEFAULT_CLIENT: ClientFilters = {
  scoreRC: [SCORE_MIN, SCORE_MAX],
  scoreIE: [SCORE_MIN, SCORE_MAX],
  regioesOcultas: [],
};

interface FilterContextValue {
  server: ServerFilters;
  client: ClientFilters;
  serverParams: Record<string, string>;
  setServerField: <K extends keyof ServerFilters>(key: K, value: ServerFilters[K]) => void;
  setClientField: <K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) => void;
  toggleRegiaoOculta: (regiao: Regiao) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({
  children,
  debounceMs = 350,
}: {
  children: ReactNode;
  debounceMs?: number;
}) {
  const [server, setServer] = useState<ServerFilters>(DEFAULT_SERVER);
  const [client, setClient] = useState<ClientFilters>(DEFAULT_CLIENT);

  const debouncedServer = useDebounce(server, debounceMs);

  const serverParams = useMemo<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    if (debouncedServer.mesAno) out.mesAno = debouncedServer.mesAno;
    if (debouncedServer.mesInicio) out.mesInicio = debouncedServer.mesInicio;
    if (debouncedServer.mesFim) out.mesFim = debouncedServer.mesFim;
    if (debouncedServer.indicador && debouncedServer.indicador.length > 0) {
      out.indicador = debouncedServer.indicador.join(",");
    }
    return out;
  }, [debouncedServer]);

  const setServerField = useCallback(
    <K extends keyof ServerFilters>(key: K, value: ServerFilters[K]) => {
      setServer((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setClientField = useCallback(
    <K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) => {
      setClient((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleRegiaoOculta = useCallback((regiao: Regiao) => {
    setClient((prev) => ({
      ...prev,
      regioesOcultas: prev.regioesOcultas.includes(regiao)
        ? prev.regioesOcultas.filter((r) => r !== regiao)
        : [...prev.regioesOcultas, regiao],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setServer(DEFAULT_SERVER);
    setClient(DEFAULT_CLIENT);
  }, []);

  const value = useMemo(
    () => ({
      server,
      client,
      serverParams,
      setServerField,
      setClientField,
      toggleRegiaoOculta,
      resetFilters,
    }),
    [server, client, serverParams, setServerField, setClientField, toggleRegiaoOculta, resetFilters]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters deve ser usado dentro de FilterProvider");
  return ctx;
}

export function isRankingRowVisible(
  row: { uf: string; regiao: string; score_eixo_i: number; score_eixo_ii: number },
  client: ClientFilters
): boolean {
  if (client.regioesOcultas.includes(row.regiao as Regiao)) return false;
  if (row.score_eixo_i < client.scoreRC[0] || row.score_eixo_i > client.scoreRC[1]) return false;
  if (row.score_eixo_ii < client.scoreIE[0] || row.score_eixo_ii > client.scoreIE[1]) return false;
  return true;
}

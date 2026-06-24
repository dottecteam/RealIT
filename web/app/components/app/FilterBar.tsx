"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGrid,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  CalendarRange,
  Sliders,
  Map,
  MapPin,
} from "lucide-react";
import { OPCOES_VISIBILIDADE, SECOES_FILTRO } from "../../constants/components/filterOptions";
import { exportarPDF } from "../../utils/exportPDF";
import { exportarXLSX } from "../../utils/exportXLSX";
import { exportarCSV } from "../../utils/exportCSV";
import { mockDadosScoreCompleto } from "../../mocks/score";
import {
  useFilters,
  SCORE_MIN,
  SCORE_MAX,
  type Regiao,
} from "../../contexts/FilterContext";
import { ESTADOS } from "../../constants/charts/chartOptions";
import type { Regiao as RegiaoMap } from "../../constants/map/brasilMapPaths";
import { BRASIL_PATHS } from "../../constants/map/brasilMapPaths";

const MESES = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Fev" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Abr" },
  { value: "05", label: "Mai" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Ago" },
  { value: "09", label: "Set" },
  { value: "10", label: "Out" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dez" },
];

const ANO_MIN = 2020;
const ANO_MAX = new Date().getFullYear();
const ANOS = Array.from({ length: ANO_MAX - ANO_MIN + 1 }, (_, i) => String(ANO_MIN + i));

const REGIOES_LIST: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

const UFS_POR_REGIAO: Record<RegiaoMap, { uf: string; nome: string }[]> = (() => {
  const acc: Record<RegiaoMap, { uf: string; nome: string }[]> = {
    Norte: [],
    Nordeste: [],
    "Centro-Oeste": [],
    Sudeste: [],
    Sul: [],
  };
  BRASIL_PATHS.forEach((p) => {
    acc[p.regiao].push({ uf: p.uf, nome: ESTADOS[p.uf] ?? p.uf });
  });
  (Object.keys(acc) as RegiaoMap[]).forEach((r) =>
    acc[r].sort((a, b) => a.uf.localeCompare(b.uf))
  );
  return acc;
})();

function parseAaaaMm(value: string | null): { ano: string; mes: string } {
  if (!value || value.length !== 6) return { ano: "", mes: "" };
  return { ano: value.slice(0, 4), mes: value.slice(4, 6) };
}

function joinAaaaMm(ano: string, mes: string): string | null {
  if (!ano || !mes) return null;
  return `${ano}${mes}`;
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative flex-1">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs font-bold text-gray-700 cursor-pointer hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

function PeriodoPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const externo = parseAaaaMm(value);
  const [mes, setMes] = useState(externo.mes);
  const [ano, setAno] = useState(externo.ano);

  // Sincroniza com o contexto (ex.: ao resetar filtros).
  useEffect(() => {
    setMes(externo.mes);
    setAno(externo.ano);
  }, [externo.mes, externo.ano]);

  const commit = (novoAno: string, novoMes: string) => {
    if (!novoAno && !novoMes) {
      if (value !== null) onChange(null);
      return;
    }
    const completo = joinAaaaMm(novoAno, novoMes);
    if (completo !== value) onChange(completo);
  };

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex gap-2">
        <SelectField
          ariaLabel={`${label} - mês`}
          value={mes}
          placeholder="Mês"
          options={MESES}
          onChange={(novoMes) => {
            setMes(novoMes);
            commit(ano, novoMes);
          }}
        />
        <SelectField
          ariaLabel={`${label} - ano`}
          value={ano}
          placeholder="Ano"
          options={ANOS.map((a) => ({ value: a, label: a }))}
          onChange={(novoAno) => {
            setAno(novoAno);
            commit(novoAno, mes);
          }}
        />
      </div>
    </div>
  );
}

function DualRangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  accentLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  accentLabel: string;
}) {
  const [local, setLocal] = useState<[number, number]>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincroniza com o contexto ao resetar filtros.
  useEffect(() => {
    setLocal(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[0], value[1]]);

  const commit = (next: [number, number]) => {
    setLocal(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(next), 80);
  };

  const [lo, hi] = local;
  const range = max - min;
  const leftPct = ((lo - min) / range) * 100;
  const rightPct = ((hi - min) / range) * 100;

  // thumb LOW precisa de z-index maior que HIGH quando ultrapassa o ponto médio
  const loOnTop = leftPct > 50;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>
          Min: <span className="text-primary tabular-nums">{lo.toFixed(1)}</span>
        </span>
        <span className="text-gray-300">{accentLabel}</span>
        <span>
          Max: <span className="text-primary tabular-nums">{hi.toFixed(1)}</span>
        </span>
      </div>
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-primary to-primary-light rounded-full"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => commit([Math.min(Number(e.target.value), hi), hi])}
          className="range-thumb"
          style={{ zIndex: loOnTop ? 4 : 3 }}
          aria-label={`${accentLabel} mínimo`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => commit([lo, Math.max(Number(e.target.value), lo)])}
          className="range-thumb"
          style={{ zIndex: loOnTop ? 3 : 4 }}
          aria-label={`${accentLabel} máximo`}
        />
      </div>
      <div className="flex justify-between text-[9px] font-medium text-gray-300 tabular-nums">
        <span>{min.toFixed(1)}</span>
        <span>{max.toFixed(1)}</span>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-xs font-bold text-gray-700 hover:text-primary transition-colors uppercase tracking-wider"
      >
        <span className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-primary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 pt-1 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const [menuAberto, setMenuAberto] = useState<"vis" | "filter" | "download" | null>(null);
  const {
    server,
    setServerField,
    client,
    setClientField,
    toggleRegiaoOculta,
    toggleUfOculta,
    resetFilters,
  } = useFilters();

  const fecharMenus = () => setMenuAberto(null);

  const indicadoresSelecionados = useMemo(
    () => new Set(server.indicador ?? []),
    [server.indicador]
  );

  const toggleIndicador = (id: string) => {
    const atual = new Set(indicadoresSelecionados);
    if (atual.has(id)) atual.delete(id);
    else atual.add(id);
    setServerField("indicador", atual.size === 0 ? null : Array.from(atual));
  };

  const filtrosAtivos = useMemo(() => {
    let count = 0;
    if (server.mesInicio) count++;
    if (server.mesFim) count++;
    if (server.indicador && server.indicador.length > 0) count++;
    if (client.scoreRC[0] !== SCORE_MIN || client.scoreRC[1] !== SCORE_MAX) count++;
    if (client.scoreIE[0] !== SCORE_MIN || client.scoreIE[1] !== SCORE_MAX) count++;
    if (client.regioesOcultas.length > 0) count++;
    if (client.ufsOcultas.length > 0) count++;
    return count;
  }, [server, client]);

  return (
    <div className="relative w-full sm:w-auto" id="filter-bar">
      <div className="bg-white rounded-full shadow-lg border border-gray-100 p-1.5 h-14 flex items-center justify-around gap-1.5 min-w-[180px]">
        <button
          onClick={() => setMenuAberto(menuAberto === "vis" ? null : "vis")}
          title="Visibilidade"
          className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "vis"
              ? "bg-primary text-white shadow-md"
              : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        <button
          onClick={() => setMenuAberto(menuAberto === "filter" ? null : "filter")}
          title="Filtros"
          className={`relative flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "filter"
              ? "bg-primary text-white shadow-md"
              : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <Filter className="w-5 h-5" />
          {filtrosAtivos > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-secondary text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
              {filtrosAtivos}
            </span>
          )}
        </button>

        <button
          onClick={() => setMenuAberto(menuAberto === "download" ? null : "download")}
          title="Exportar"
          className={`flex-1 flex items-center justify-center h-full rounded-full transition-all duration-300 ${
            menuAberto === "download"
              ? "bg-primary text-white shadow-md"
              : "text-gray-400 hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {menuAberto === "vis" && (
        <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[450px] max-w-[450px] bg-white shadow-2xl rounded-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <p className="font-black text-primary uppercase text-[10px] tracking-[0.2em] mb-4">
            Gerenciar Visibilidade
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {OPCOES_VISIBILIDADE.map((opcao) => (
              <label key={opcao.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-primary checked:border-primary transition-all duration-200"
                    defaultChecked
                  />
                  <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 ml-0.5 transition-opacity" />
                </div>
                <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">
                  {opcao.texto}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {menuAberto === "filter" && (
        <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-primary font-black uppercase text-[10px] tracking-[0.2em]">
              Refinar Análise
            </h2>
            {filtrosAtivos > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar
              </button>
            )}
          </div>

          <FilterSection
            title="Período"
            icon={<CalendarRange className="w-3.5 h-3.5" />}
            defaultOpen
          >
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <PeriodoPicker
                label="De"
                value={server.mesInicio}
                onChange={(v) => setServerField("mesInicio", v)}
              />
              <PeriodoPicker
                label="Até"
                value={server.mesFim}
                onChange={(v) => setServerField("mesFim", v)}
              />
            </div>
          </FilterSection>

          <FilterSection
            title="Faixa de Score"
            icon={<Sliders className="w-3.5 h-3.5" />}
            defaultOpen
          >
            <div className="space-y-5 pt-2 px-1">
              <DualRangeSlider
                min={SCORE_MIN}
                max={SCORE_MAX}
                step={0.1}
                value={client.scoreRC}
                onChange={(v) => setClientField("scoreRC", v)}
                accentLabel="Risco de Crédito (RC)"
              />
              <DualRangeSlider
                min={SCORE_MIN}
                max={SCORE_MAX}
                step={0.1}
                value={client.scoreIE}
                onChange={(v) => setClientField("scoreIE", v)}
                accentLabel="Inclusão (IE)"
              />
            </div>
          </FilterSection>
          <FilterSection title="Regiões" icon={<Map className="w-3.5 h-3.5" />}>
            <div className="flex flex-wrap gap-2 pt-2">
              {REGIOES_LIST.map((regiao) => {
                const ativa = !client.regioesOcultas.includes(regiao);
                return (
                  <button
                    key={regiao}
                    type="button"
                    onClick={() => toggleRegiaoOculta(regiao)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                      ativa
                        ? "bg-primary text-white shadow-sm hover:bg-primary-dark"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    {regiao}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <FilterSection title="Estados" icon={<MapPin className="w-3.5 h-3.5" />}>
            <div className="space-y-3 pt-2">
              {REGIOES_LIST.map((regiao) => {
                const ufs = UFS_POR_REGIAO[regiao];
                const todosVisiveis = ufs.every((u) => !client.ufsOcultas.includes(u.uf));
                const toggleTodos = () => {
                  if (todosVisiveis) {
                    setClientField("ufsOcultas", [
                      ...new Set([...client.ufsOcultas, ...ufs.map((u) => u.uf)]),
                    ]);
                  } else {
                    const ufsRegiao = new Set(ufs.map((u) => u.uf));
                    setClientField(
                      "ufsOcultas",
                      client.ufsOcultas.filter((u) => !ufsRegiao.has(u))
                    );
                  }
                };
                return (
                  <div key={regiao}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {regiao}
                      </span>
                      <button
                        type="button"
                        onClick={toggleTodos}
                        className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider"
                      >
                        {todosVisiveis ? "Ocultar todos" : "Mostrar todos"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ufs.map(({ uf, nome }) => {
                        const ativa = !client.ufsOcultas.includes(uf);
                        return (
                          <button
                            key={uf}
                            type="button"
                            title={nome}
                            onClick={() => toggleUfOculta(uf)}
                            className={`min-w-[40px] px-2 py-1 rounded-md text-[11px] font-black tracking-tight transition-all ${
                              ativa
                                ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                : "bg-gray-50 text-gray-300 hover:bg-gray-100 line-through"
                            }`}
                          >
                            {uf}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </FilterSection>

          {/*
          {SECOES_FILTRO.map((secao) => (
            <FilterSection
              key={secao.categoria}
              title={secao.categoria}
              icon={<Filter className="w-3.5 h-3.5" />}
            >
              <div className="space-y-1 pt-1">
                {secao.opcoes.map((opcao) => {
                  const marcado = indicadoresSelecionados.has(opcao.id);
                  return (
                    <label
                      key={opcao.id}
                      className="flex items-center gap-3 cursor-pointer group py-0.5"
                    >
                      <input
                        type="checkbox"
                        className="accent-primary w-4 h-4 rounded"
                        checked={marcado}
                        onChange={() => toggleIndicador(opcao.id)}
                      />
                      <span className="text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">
                        {opcao.texto}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FilterSection>
          ))}
          */}
        </div>
      )}

      {menuAberto === "download" && (
        <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[280px] bg-white shadow-2xl rounded-2xl p-6 z-[9999] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 esconder-no-pdf">
          <h2 className="text-primary font-black uppercase text-[10px] tracking-[0.2em] mb-2">
            Exportar Dados
          </h2>
          <p className="text-[11px] text-gray-400 mb-5 font-medium">
            Selecione o formato para baixar as métricas visualizadas atualmente.
          </p>

          <div className="space-y-2">
            <button
              onClick={async () => {
                try {
                  await exportarPDF();
                } catch (error) {
                  console.error("Erro ao gerar PDF:", error);
                }
              }}
              className="w-full text-left bg-gray-50 hover:bg-primary hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest active:scale-95"
            >
              DOWNLOAD EM PDF
              <Download className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={exportarXLSX}
              className="w-full text-left bg-gray-50 hover:bg-green-600 hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest active:scale-95"
            >
              DOWNLOAD EM EXCEL
              <Download className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => exportarCSV(mockDadosScoreCompleto.dadosScore, "Relatorio_Estados")}
              className="w-full text-left bg-gray-50 hover:bg-gray-800 hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest active:scale-95"
            >
              CSV - POR ESTADO
              <Download className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => exportarCSV(mockDadosScoreCompleto.dadosMediaRegiao, "Relatorio_Regioes")}
              className="w-full text-left bg-gray-50 hover:bg-gray-800 hover:text-white p-4 rounded-xl text-xs font-black text-gray-600 transition-all flex items-center justify-between group uppercase tracking-widest active:scale-95"
            >
              CSV - POR REGIÃO
              <Download className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}

      {menuAberto && (
        <div className="fixed inset-0 z-[9998]" onClick={fecharMenus} />
      )}
    </div>
  );
}

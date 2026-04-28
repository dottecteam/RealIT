"use client";

import { useState } from "react";
import { LayoutGrid, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react'


const opcoesVisibilidade = [
    {id: "inadimplencia", texto: "Ranking de Inadimplência Real"},
    {id: "composicao", texto: "Composição da Carteira"},
    {id: "aging", texto: "Aging da Dívida"},
    {id: "escolarizacao", texto: "Taxa de Escolarização"},
    {id: "maturidade", texto: "Maturidade do PIX"},
    {id: "radar", texto: "Radar Comparativo"},
    {id: "projecao", texto: "Projeção do Score RC e IE"},
    {id: "evolucao", texto: "Evolução da Carteira"}
]

const opcoesFiltro = [
    {categoria: "Credituário", opcoes: [
        {id: "credito_pessoal", texto: "Crédito pessoal"},
        {id: "consignado", texto: "Consignado"},
        {id: "financiamento_imobiliario", texto: "Financiamento imobiliário"},
        {id: "financiamento_veiculos", texto: "Financiamento de veículos"},
        {id: "cartao_credito", texto: "Cartão de crédito"}
    ]},
    {categoria: "Endividamento", opcoes: [
        {id: "percentual_renda", texto: "% da renda"},
        {id: "comprometimento_renda", texto: "Comprometimento da renda"},
        {id: "endividamento_tipo_credito", texto: "Endividamento por tipo de crédito"},
        {id: "endividamento_faixa_renda", texto: "Endividamento por faixa de renda"},
        {id: "participacao_credito_orcamento", texto: "Participação do crédito no orçamento familiar"}
    ]},
    {categoria: "Crescimento Carteira", opcoes: [
        {id: "carteria_pf_vs_pj", texto: "Carteria PF vs PJ"},
        {id: "imobiliario", texto: "Imobiliário"},
        {id: "veiculos", texto: "Veículos"},
        {id: "consignado", texto: "Consignado"},
    ]},
    {categoria: "Inadimplência", opcoes: [
        {id: "volume_mensal_concessao_total", texto: "Volume mensal de concessão total"},
        {id: "credito_pessoal", texto: "Crédito pessoal"},
        {id: "consignado", texto: "Consignado"},
        {id: "financiamento_imobiliario", texto: "Financiamento imobiliário"},
        {id: "financiamento_veiculos", texto: "Financiamento de veículos"},
    ]},
    {categoria: "Dados PIX", opcoes: [
        {id: "valor_total_movimentado", texto: "Valor total movimentedo"},
        {id: "valor_medio_transacao", texto: "Valor médio por transação"},
        {id: "transacao_pf", texto: "Transação por PF"},
        {id: "transacao_pj", texto: "Transação por PJ"},
        {id: "percentual_crescimento_mensal", texto: "Percentual de crescimento mensal"}
    ]}
]

const opcoesDownload = [
    {id: "csv", texto: "Download em CSV"},
    {id: "excel", texto: "Download em Excel"},
    {id: "pdf", texto: "Download em PDF"},
    {id: "json", texto: "Download em JSON"},
    {id: "xml", texto: "Download em XML"}
]



type SectionProps = {
  title: string;
  children?: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer py-2 font-bold text-black"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {open && <div className="pl-2 mt-2">{children}</div>}
    </div>
  );
}

export default function FilterBar(){
    const [ barraVisibilidade, setVisibilidade] = useState(false);
    const [ barraFiltros, setFiltros] = useState(false);
    const [ barraDownload, setDownload] = useState(false);

    const fecharTodos = () => {
        setVisibilidade(false);
        setFiltros(false);
        setDownload(false);
    };
    

    return (
        <div className="relative w-full sm:w-1/2">
            <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-2 min-h-[60px] flex justify-center gap-2">
                
                <div onClick={() => { fecharTodos(); setVisibilidade(!barraVisibilidade)}} className={`w-1/6 flex items-center justify-center cursor-pointer hover:bg-[#F6F6F6] rounded-[10px] ${barraVisibilidade ? "bg-blue-100" : "bg-white"}`}>
                    <LayoutGrid className="w-6 h-6 text-black" />
                </div>

                <div onClick={() => { fecharTodos(); setFiltros(!barraFiltros)}} className={`w-1/6 flex items-center justify-center cursor-pointer hover:bg-[#F6F6F6] rounded-[10px] ${barraFiltros ? "bg-blue-100" : "bg-white"}`}>
                    <Filter className="w-6 h-6 text-black" />
                </div>

                <div onClick={() => { fecharTodos(); setDownload(!barraDownload)}} className={`w-1/6 flex items-center justify-center cursor-pointer hover:bg-[#F6F6F6] rounded-[10px] ${barraDownload ? "bg-blue-100" : "bg-white"}`}>
                    <Download className="w-6 h-6 text-black" />
                </div>
            </div>

            {barraVisibilidade && (
                <div className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] sm:w-[400px] md:w-[500px] max-h-[70vh] overflow-y-auto bg-white shadow-xl rounded-2xl p-4 z-[9999]">
                    <p className="font-bold mb-3 text-[#202ad0]">Visibilidade dos Gráficos</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {opcoesVisibilidade.map(opcao => (
                            <label className="flex items-center gap-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {barraFiltros && (
                <div className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] sm:w-[320px] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-4 z-[9999]">
                    <h2 className="text-lg text-[#202ad0] font-bold mb-4">Filtros</h2>

                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">De</span>
                            <input type="text" placeholder="01/01/2001" className="bg-white rounded-full px-3 py-1 text-sm w-full" />
                            <span>até</span>
                            <input type="text" placeholder="31/01/2012" className="bg-white rounded-full px-3 py-1 text-sm w-full" />
                        </div>
                    </div>

                    <Section title="Endividamento">
                        {opcoesFiltro.find(secao => secao.categoria === "Endividamento")?.opcoes.map(opcao => (
                            <label className="flex items-center gap-2 mb-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </Section>

                    <Section title="Crescimento Carteira">
                        {opcoesFiltro.find(secao => secao.categoria === "Crescimento Carteira")?.opcoes.map(opcao => (
                            <label className="flex items-center gap-2 mb-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </Section>

                    <Section title="Inadimplência">
                        {opcoesFiltro.find(secao => secao.categoria === "Inadimplência")?.opcoes.map(opcao => (
                            <label className="flex items-center gap-2 mb-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </Section>

                    <Section title="Dados PIX">
                        {opcoesFiltro.find(secao => secao.categoria === "Dados PIX")?.opcoes.map(opcao => (
                            <label className="flex items-center gap-2 mb-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </Section>

                    <Section title="Credituário">
                        {opcoesFiltro.find(secao => secao.categoria === "Credituário")?.opcoes.map(opcao => (
                            <label className="flex items-center gap-2 mb-2 select-none" key={opcao.id}>
                                <input type="checkbox" defaultChecked />
                                {opcao.texto}
                            </label>
                        ))}
                    </Section>
                </div>
            )}

            {barraDownload && (
                <div className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] sm:w-[320px] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-4 z-[9999]">
                    <h2 className="text-lg text-[#202ad0] font-bold mb-4">Download</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Selecione o formato de download desejado:
                    </p>
                    <div className="flex flex-col gap-2">
                        {opcoesDownload.map(opcao => (
                            <button key={opcao.id} className="cursor-pointer bg-[#202ad0] text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#1a1f8c] transition-colors">
                                {opcao.texto}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
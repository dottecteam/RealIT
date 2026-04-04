import Image from "next/image";
import { Button } from "../../components/Button";
import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-[#F6F6F6]">
      
      {/* 1. HERO SECTION (Azul principal) */}
      <section className="bg-[#202AD0] text-white relative overflow-hidden py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
          
          {/* Lado Esquerdo*/}
          <div className="flex-1 relative flex justify-center md:justify-start">
            <div className="w-full max-w-[400px] aspect-[4/5] bg-white/10 rounded-3xl border-2 border-dashed border-white/30 flex items-center justify-center text-center p-6 hover:border-[#4EDAD3] transition-colors">
                <span className="text-white/70 font-medium">
                  
                </span>
            </div>
          </div>

          {/* Lado Direito*/}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
              TRANSFORMANDO <br />
              DADOS PÚBLICOS <span className="text-[#FFE372]">EM OPORTUNIDADES</span> REAIS DE CRÉDITO
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
              <Button link="/login" bgColor="#FFE372" textColor="#202AD0" className="text-lg px-8">
                Acesse já
              </Button>
              <Button link="/solicitar" bgColor="#4EDAD3" textColor="#202AD0" className="text-lg px-8">
                Solicitar Acesso
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Faixa Amarela) */}
      <section className="bg-[#FFE372] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 text-center text-[#202AD0]">
          <div className="flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="text-4xl font-black">6</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1">Anos de Dados</span>
          </div>
          <div className="flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="text-4xl font-black">+10 mil</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1">Dados Processados</span>
          </div>
          <div className="flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="text-4xl font-black">+300</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1">Redes Analisadas</span>
          </div>
          <div className="flex flex-col items-center hover:-translate-y-1 transition-transform">
            <span className="text-4xl font-black">26</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1">Estados Atendidos</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION (Fundo claro) */}
      <section className="py-24 px-6 bg-[#F6F6F6]">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-16">
            Por que escolher a <span className="text-[#202AD0] font-black">Real IT</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              { title: "Confiabilidade dos Dados", desc: "Utilizamos fontes de dados públicas confiáveis para oferecer análises precisas." },
              { title: "Análise Preditiva", desc: "Não apenas mostramos dados, transformamos números em insights." },
              { title: "Escalabilidade", desc: "Uma infraestrutura pronta para crescer. Processe grandes volumes de dados." },
              { title: "Histórico de Dados", desc: "Armazenamento que permite análises temporais e tendências de mercado." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-start hover:-translate-y-1 hover:shadow-lg transition-all border border-transparent hover:border-[#ADADAD]">
                {/* Ícone azul com hover escuro */}
                <div className="w-10 h-10 bg-[#202AD0] rounded-lg mb-6 flex items-center justify-center transition-colors"></div>
                <h3 className="font-bold text-zinc-800 mb-3 text-lg">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Como funciona?) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-20">
            Como <span className="text-[#202AD0] font-black">funciona</span>?
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-between w-full relative">
            {/* Linha conectora */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-[#F6F6F6] z-0"></div>

            {[
              { step: 1, title: "Faça seu Cadastro", desc: "Preencha seus dados em menos de 5 minutos." },
              { step: 2, title: "Análise Automática", desc: "Nossa IA avalia os dados para formar seu perfil." },
              { step: 3, title: "Receba sua Proposta", desc: "Você recebe uma proposta sob medida." },
              { step: 4, title: "Aprovado!", desc: "Crédito aprovado direto na sua conta." }
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center relative z-10 flex-1 px-4 mb-10 md:mb-0 group">
                <div className="w-12 h-12 bg-[#202AD0] group-hover:bg-[#0006A9] transition-colors rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-[#202AD0]/20">
                  {item.step}
                </div>
                <h3 className="font-bold text-zinc-800 mb-2 text-base">{item.title}</h3>
                <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-24 px-6 bg-[#F6F6F6]">
        <div className="max-w-3xl mx-auto flex flex-col w-full">
          <h2 className="text-3xl md:text-4xl font-black text-[#202AD0] mb-12 text-center md:text-left">
            Dúvidas frequentes
          </h2>

          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <button key={item} className="w-full bg-white p-6 rounded-xl shadow-sm border border-transparent flex items-center justify-between hover:border-[#202AD0] hover:shadow-md transition-all text-left group">
                <span className="font-medium text-zinc-700 text-sm md:text-base group-hover:text-[#202AD0] transition-colors">Como faço para solicitar meu cartão DM?</span>
                <ChevronDown className="text-[#202AD0] group-hover:text-[#0006A9] w-5 h-5 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="bg-[#202AD0] py-24 px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Faltou crédito para as compras do dia a dia?
        </h2>
        <p className="text-white/80 mb-10">
          Junte-se a mais de 1,5 milhões de clientes que já aproveitam as oportunidades da DM.
        </p>
        <Button link="/solicitar" bgColor="#4EDAD3" textColor="#202AD0" className="text-lg px-10 py-4 hover:shadow-lg">
          Acesse já
        </Button>
      </section>

    </div>
  );
}
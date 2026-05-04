import { Button } from "../../components/Button";
import { ChevronDown, ShieldCheck, TrendingUp, Zap, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-background">
      
      <section className="bg-primary text-white relative overflow-hidden py-20 md:py-32 px-6">
        <div className="container-responsive flex flex-col md:flex-row items-center justify-between relative z-10 gap-16">
          
          <div className="flex-1 relative flex justify-center md:justify-start w-full">
            <div className="w-full max-w-[450px] aspect-[4/3] bg-white/5 rounded-[40px] border-2 border-dashed border-white/20 flex items-center justify-center text-center p-6 hover:border-tertiary transition-all duration-500 group">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database className="text-tertiary w-10 h-10" />
                </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter mb-8">
              TRANSFORMANDO <br />
              DADOS PÚBLICOS <span className="text-secondary">EM OPORTUNIDADES</span> REAIS
            </h1>
            
            <p className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed font-medium">
              A plataforma definitiva para análise de mercado e concessão de crédito baseada em dados demográficos e econômicos precisos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start font-bold">
              <Button link="/login" className="text-lg px-10 py-4 shadow-xl shadow-black/10">
                Acesse agora
              </Button>
              <Button link="/solicitar" bgColor="bg-tertiary" className="text-lg px-10 py-4">
                Solicitar Acesso
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 blur-3xl" />
      </section>

      <section className="bg-secondary py-10 px-6 shadow-inner">
        <div className="container-responsive flex flex-wrap justify-center md:justify-between items-center gap-10 text-primary">
          {[
            { val: "6", label: "Anos de Dados" },
            { val: "+10 mil", label: "Dados Processados" },
            { val: "+300", label: "Redes Analisadas" },
            { val: "26", label: "Estados Atendidos" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center hover:-translate-y-1 transition-all duration-300">
              <span className="text-5xl font-black tracking-tighter">{stat.val}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 opacity-80">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-28 px-6">
        <div className="container-responsive flex flex-col items-center">
          <div className="text-center max-w-2xl mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Por que escolher a <span className="text-primary">Real IT</span>?
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Unimos tecnologia de ponta e fontes oficiais para entregar a visão mais completa do cenário econômico brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              { icon: ShieldCheck, title: "Confiabilidade", desc: "Fontes de dados públicas e auditáveis para garantir precisão absoluta." },
              { icon: TrendingUp, title: "Análise Preditiva", desc: "Transformamos tendências históricas em projeções futuras de mercado." },
              { icon: Zap, title: "Escalabilidade", desc: "Infraestrutura cloud-native pronta para processar milhões de registros em segundos." },
              { icon: Database, title: "Big Data Social", desc: "Cruzamento inteligente de dados para formar perfis de crédito assertivos." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col items-start group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="text-primary group-hover:text-white w-7 h-7 transition-colors" />
                </div>
                <h3 className="font-black text-gray-900 mb-4 text-xl tracking-tight">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6 bg-white rounded-[60px] md:rounded-[100px] shadow-sm">
        <div className="container-responsive flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-20 tracking-tight">
            Como <span className="text-primary">funciona</span>?
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-between w-full relative gap-12">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-100 z-0"></div>

            {[
              { step: "01", title: "Cadastro", desc: "Acesso rápido e seguro à plataforma em poucos passos." },
              { step: "02", title: "Integração", desc: "Nossa IA processa as variáveis públicas da sua região." },
              { step: "03", title: "Diagnóstico", desc: "Visualização clara dos scores de risco e oportunidade." },
              { step: "04", title: "Decisão", desc: "Insights estratégicos para expansão de carteira." }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 flex-1 px-4 group">
                <div className="w-20 h-20 bg-white border-4 border-gray-50 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 transition-all duration-500 rounded-full flex items-center justify-center font-black text-2xl mb-8 shadow-xl shadow-black/5">
                  {item.step}
                </div>
                <h3 className="font-black text-gray-900 mb-3 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium max-w-[200px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 px-6">
        <div className="container-responsive flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-6 tracking-tight">
              Dúvidas <br />frequentes
            </h2>
            <p className="text-gray-500 font-medium">
              Tudo o que você precisa saber sobre a Real IT e nossas fontes de dados.
            </p>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4">
            {[1, 2, 3, 4].map((item) => (
              <button key={item} className="w-full bg-white p-8 rounded-3xl shadow-sm border border-transparent flex items-center justify-between hover:border-primary/20 hover:shadow-md transition-all text-left group">
                <span className="font-bold text-gray-700 text-base group-hover:text-primary transition-colors leading-tight">
                  Quais são as principais fontes de dados utilizadas no mapeamento?
                </span>
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronDown className="text-primary w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-24 px-6 relative overflow-hidden">
        <div className="container-responsive flex flex-col items-center text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight max-w-3xl">
            Pronto para revolucionar sua análise de crédito?
          </h2>
          <p className="text-white/70 mb-12 max-w-xl text-lg font-medium">
            Junte-se às empresas que já utilizam a Real IT para tomar decisões baseadas em dados concretos.
          </p>
          <Button link="/solicitar" bgColor="bg-secondary" className="text-lg px-12 py-5 shadow-2xl hover:scale-105">
            Começar agora
          </Button>
        </div>
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      </section>

    </div>
  );
}
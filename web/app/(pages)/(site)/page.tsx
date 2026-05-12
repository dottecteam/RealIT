import { Button } from "../../components/Button"
import { ChevronDown, ShieldCheck, TrendingUp, Zap, Database } from "lucide-react"
import Image from "next/image"
import MANOMASSA from "../../img/MANOMASSA.png"
import background from "../../img/background.png"

const stats = [
  { val: "+1,5 milhão", label: "Dados Processados" },
  { val: "5", label: "Redes Analisadas" },
  { val: "27", label: "Estados Atendidos" },
]
const loopedStats = [...stats, ...stats, ...stats, ...stats]

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-background">

      <section
        className="text-white relative overflow-hidden pt-20 md:py-32 pb-0 px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background.src})` }}>
        <div className="container-responsive flex flex-col md:flex-row items-center justify-between relative z-10 gap-16">
          
          {/* Tirei a imagem do massanori para telas menores*/}
          <div className="hidden lg:flex flex-1 relative justify-start w-full">
            <div className="relative w-full max-w-[700px] aspect-[4/3] rounded-[40px] overflow-hidden">
              <Image src={MANOMASSA} alt="Real IT" fill className="object-cover" priority />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pb-10 md:pb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter mb-6 md:mb-8">
              TRANSFORMANDO <br />
              DADOS PÚBLICOS{" "}
              <span className="text-secondary">EM OPORTUNIDADES</span> REAIS
            </h1>

            <p className="text-base md:text-lg text-white/80 mb-8 md:mb-10 max-w-lg leading-relaxed font-medium">
              A plataforma definitiva para análise de mercado e concessão de crédito baseada em dados demográficos e econômicos precisos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start font-bold">
              <Button
                link="/login"
                className="text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-xl shadow-black/10 hover:scale-105 duration-300"
              >
                Acesse agora
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-white/5 rounded-full -mr-32 md:-mr-64 -mt-32 md:-mt-64 blur-3xl" />
      </section>

      {/* Stats Marquee */}
      <section className="bg-secondary top-0 py-8 md:py-10 shadow-inner overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] text-primary">
          {loopedStats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-8 sm:px-12 md:px-16 border-r border-primary/20 last:border-r-0"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
                {stat.val}
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-1 md:mt-2 opacity-80">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-28 px-6">
        <div className="container-responsive flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight">
              Qualidades da <span className="text-primary">Real</span>{" "}
              <span className="text-secondary">IT</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
              Unimos tecnologia de ponta e fontes oficiais para entregar a visão mais completa do cenário econômico brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {[
              { icon: ShieldCheck, title: "Confiabilidade", desc: "Fontes de dados públicas e auditáveis para garantir precisão absoluta." },
              { icon: TrendingUp, title: "Análise Preditiva", desc: "Transformamos tendências históricas em projeções futuras de mercado." },
              { icon: Zap, title: "Escalabilidade", desc: "Infraestrutura pronta para processar milhões de registros em segundos." },
              { icon: Database, title: "Big Data Social", desc: "Cruzamento inteligente de dados para formar perfis de crédito assertivos." },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-7 md:p-10 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col items-start group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-2xl mb-6 md:mb-8 flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
                  <feature.icon className="text-primary group-hover:text-white w-6 h-6 md:w-7 md:h-7 transition-colors" />
                </div>
                <h3 className="font-black text-gray-900 mb-3 md:mb-4 text-lg md:text-xl tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 md:py-20 px-6 bg-white rounded-[40px] md:rounded-[100px] shadow-sm">
        <div className="container-responsive flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
            Fluxo do <span className="text-primary">sistema</span>
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-between w-full relative gap-10 md:gap-12">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-100 z-0" />

            {[
              { step: "01", title: "Cadastro", desc: "Acesso rápido e seguro à plataforma em poucos passos." },
              { step: "02", title: "Integração", desc: "Nossa código processa os dados públicos da sua região." },
              { step: "03", title: "Diagnóstico", desc: "Visualização clara dos scores de risco e oportunidade." },
              { step: "04", title: "Decisão", desc: "Insights estratégicos para expansão de carteira." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center relative z-10 flex-1 px-2 md:px-4 group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-gray-50 text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 transition-all duration-500 rounded-full flex items-center justify-center font-black text-xl md:text-2xl mb-5 md:mb-8 shadow-xl shadow-black/5">
                  {item.step}
                </div>
                <h3 className="font-black text-gray-900 mb-2 md:mb-3 text-base md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium max-w-[200px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-28 px-6">
        <div className="container-responsive flex flex-col lg:flex-row gap-10 md:gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-primary mb-4 md:mb-6 tracking-tight">
              Objetivo da <span className="text-primary">Real</span>{" "}
              <span className="text-secondary">IT</span>
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              Tudo o que você precisa saber sobre a Real IT e nossas fontes de dados.
            </p>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4 md:gap-6 text-gray-600">
            <p className="text-base md:text-lg leading-relaxed font-medium">
              A <span className="font-bold text-primary">Real IT</span> é uma plataforma
              de análise de mercado baseada em dados públicos, desenvolvida para
              coletar, processar e transformar informações econômicas em
              insights estratégicos para tomada de decisão.
            </p>

            <div className="space-y-2 md:space-y-3 text-sm md:text-base font-medium">
              <p>• Automatizar a coleta de dados econômicos públicos</p>
              <p>• Processar e padronizar indicadores de mercado</p>
              <p>• Gerar um índice de oportunidade (Score) para apoio à decisão</p>
              <p>• Permitir análises visuais por meio de dashboards interativos</p>
              <p>• Facilitar o consumo dos dados por outras aplicações</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
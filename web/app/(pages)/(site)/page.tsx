import { Button } from "../../components/basic/Button"
import { FeatureCard } from "../../components/site/FeatureCard"
import { StepItem } from "../../components/site/StepItem"
import { InfiniteMarquee } from "../../components/site/InfiniteMarquee"
import Image from "next/image"
import MANOMASSA from "../../assets/img/home/hero.png"
import background from "../../assets/img/home/background.png"
import { FEATURES_DATA, STATS_DATA, STEPS_DATA } from "../../constants/texts/home"

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-background">

      {/* HERO SECTION */}
      <section
        className="text-white relative overflow-hidden pt-20 md:py-32 pb-0 px-6 bg-cover bg-center bg-no-repeat min-h-[600px] lg:min-h-[650px] flex items-center"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <div className="hidden xl:block absolute inset-y-0 left-0 w-full z-0 pointer-events-none">
          <div className="container-responsive h-full relative">
            <div className="absolute left-0 bottom-0 top-0 h-full w-auto max-w-[50vw]">
              <Image
                src={MANOMASSA}
                alt="Real IT"
                className="h-full w-auto object-contain object-left-bottom"
                priority
              />
            </div>
          </div>
        </div>

        <div className="container-responsive flex flex-col xl:flex-row items-center justify-end relative z-10 gap-16 w-full">
          <div className="hidden xl:block flex-1" />

          <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left pb-10 md:pb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter mb-6 md:mb-8">
              TRANSFORMANDO <br />
              DADOS PÚBLICOS{" "}
              <span className="text-secondary">EM OPORTUNIDADES</span> REAIS
            </h1>

            <p className="text-base md:text-lg text-white/80 mb-8 md:mb-10 max-w-lg leading-relaxed font-medium">
              A plataforma definitiva para análise de mercado e concessão de crédito baseada em dados demográficos e econômicos precisos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center xl:justify-start font-bold">
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

      {/* STATS INFINITE MARQUEE COMPONENT */}
      <InfiniteMarquee items={STATS_DATA} />

      {/* QUALITIES SECTION */}
      <section className="py-16 md:py-28 px-6">
        <div className="container-responsive flex flex-col items-center">
          <div className="text-center max-w-2xl mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight">
              Qualidades da <span className="text-primary">Real</span> <span className="text-secondary">IT</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base">
              Unimos tecnologia de ponta e fontes oficiais para entregar a visão mais completa do cenário econômico brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {FEATURES_DATA.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM FLOW SECTION */}
      <section className="max-w-6xl mx-auto py-16 md:py-20 px-6 bg-white rounded-[40px] md:rounded-[100px] shadow-sm">
        <div className="container-responsive flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-12 md:mb-20 tracking-tight">
            Fluxo do <span className="text-primary">sistema</span>
          </h2>

          <div className="flex flex-col md:flex-row items-start justify-between w-full relative gap-10 md:gap-12">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-100 z-0" />

            {STEPS_DATA.map((item, i) => (
              <StepItem key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIVE SECTION */}
      <section className="py-16 md:py-28 px-6">
        <div className="container-responsive flex flex-col lg:flex-row gap-10 md:gap-16">
          <div className="lg:w-1/3">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-primary mb-4 md:mb-6 tracking-tight">
              Objetivo da <span className="text-primary">Real</span> <span className="text-secondary">IT</span>
            </h2>
            <p className="text-gray-500 font-medium text-sm md:text-base">
              Tudo o que você precisa saber sobre a Real IT e nossas fontes de dados.
            </p>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4 md:gap-6 text-gray-600">
            <p className="text-base md:text-lg leading-relaxed font-medium">
              A <span className="font-bold text-primary">Real IT</span> é uma plataforma de análise de mercado baseada em dados públicos, desenvolvida para coletar, processar e transformar informações econômicas em insights estratégicos para tomada de decisão.
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
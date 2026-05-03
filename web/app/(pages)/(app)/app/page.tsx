import { RankingChart } from "../../../components/RankingChart";
import { BrasilMap } from "../../../components/BrasilMap";
import { mockDadosMediaRegiao } from "../../../mocks/score";
import FilterBar from "../../../components/FilterBar";
import RegionFilter from "../../../components/RegionFilter";
import { RankingStates } from "../../../components/RankingStates";
import { dadosEixoI_Ranking, dadosEixoII_Ranking, dadosEixoI_Score, dadosEixoII_Score } from "../../../mocks/chartData";
import { EvolucaoScoresChart } from "../../../components/EvolucaoScoresChart";
import { ProjecaoScoreChart } from "../../../components/ProjecaoScoreChart";
import { MapProvider } from "../../../contexts/MapContext";

const periodos = ["Jan/22","Abr/22","Jul/22","Out/22","Jan/23","Abr/23","Jul/23","Out/23","Jan/24","Abr/24","Jul/24"]
const mesesProjecao = ["Jan/23","Abr/23","Jul/23","Out/23","Jan/24","Abr/24","Jul/24","Out/24","Jan/25","Abr/25","Jul/25"]


export default function Dashboard() {
  return (
    <MapProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 px-3 sm:px-4 md:px-6 bg-[#F6F6F6]">

        {/* Mapa */}
        <div className="flex justify-center items-start w-full">
          <div className="w-full max-w-[900px] aspect-[4/3]">
            <BrasilMap />
          </div>
        </div>

        {/* Scores lado a lado */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <RegionFilter />
            <FilterBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RankingChart
              title="Risco de Crédito"
              info="Composição do score de risco de crédito para cada região do Brasil."
              series={dadosEixoI_Score}
            />
            <RankingChart
              title="Inclusão Demográfica"
              info="Composição do score de inclusão demográfica para cada região do Brasil."
              series={dadosEixoII_Score}
            />
          </div>
        </div>
      </div>
      
      {/* EVOLUÇÃO E PROJEÇÃO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-3 sm:px-4 md:px-6 mt-6 bg-[#F6F6F6]">
        <EvolucaoScoresChart
          categorias={periodos}
          info="Mostra como o Score de Risco de Crédito e o Score de Inclusão e Expansão de cada região evoluíram ao longo dos períodos disponíveis. Linhas sólidas representam o RC e linhas tracejadas o IE, com uma cor por região. O gráfico permite identificar movimentos estratégicos relevantes — uma região que estava deteriorando e começou a melhorar, ou um mercado que era pouco explorado e está rapidamente se tornando competitivo."
          series={[
            { name: "RC — SP", data: [2.4,2.3,2.3,2.2,2.2,2.1,2.1,2.1,2.0,2.0,2.0] },
            { name: "IE — SP", data: [4.0,4.0,4.1,4.1,4.2,4.2,4.3,4.3,4.3,4.4,4.4] },
            { name: "RC — RJ", data: [3.2,3.2,3.3,3.3,3.2,3.2,3.1,3.1,3.1,3.0,3.0] },
            { name: "IE — RJ", data: [3.5,3.5,3.6,3.6,3.7,3.7,3.8,3.8,3.8,3.9,3.9] },
            { name: "RC — MG", data: [2.8,2.8,2.7,2.7,2.6,2.6,2.5,2.5,2.5,2.4,2.4] },
            { name: "IE — MG", data: [3.0,3.1,3.1,3.2,3.2,3.3,3.3,3.4,3.4,3.4,3.5] },
            { name: "RC — ES", data: [2.5,2.5,2.4,2.4,2.3,2.3,2.3,2.2,2.2,2.2,2.1] },
            { name: "IE — ES", data: [2.8,2.9,2.9,3.0,3.0,3.1,3.2,3.2,3.3,3.3,3.4] },
          ]}
        />
        <ProjecaoScoreChart
          categorias={mesesProjecao}
          marcadorProjecao="Jul/24"
          info="Projeta a trajetória futura dos dois scores consolidados — Risco de Crédito e Inclusão e Expansão — para o estado selecionado. A projeção é calculada a partir dos valores históricos de cada parâmetro, que são estimados individualmente e depois recombinados pela mesma fórmula de normalização e ponderação usada no modelo. O resultado indica se o estado tende a migrar de quadrante estratégico nos próximos períodos, o que é determinante para decisões de timing de entrada ou expansão no mercado."
          series={[
            { name: "RC — Histórico", data: [2.4,2.3,2.2,2.2,2.1,2.1,2.0,null,null,null,null] },
            { name: "RC — Projeção",  data: [null,null,null,null,null,null,2.0,1.9,1.9,1.8,1.8] },
            { name: "IE — Histórico", data: [3.8,3.9,4.0,4.0,4.1,4.2,4.2,null,null,null,null] },
            { name: "IE — Projeção",  data: [null,null,null,null,null,null,4.2,4.3,4.3,4.4,4.5] },
          ]}
        />
      </div>

      <br />
      <br />

      {/* RANKING POR ESTADO */}
      <div className="px-3 sm:px-6 md:px-10 lg:px-20 mt-10 pb-10 bg-[#F6F6F6]">
        <h3 className="text-2xl font-black text-[#202AD0] mb-6 text-center">
          Ranking Geral por Estado
        </h3>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-center text-zinc-500 font-bold mb-3 uppercase tracking-wider text-sm">Eixo I</p>
            <RankingStates series={dadosEixoI_Ranking} />
          </div>
          <div>
            <p className="text-center text-zinc-500 font-bold mb-3 uppercase tracking-wider text-sm">Eixo II</p>
            <RankingStates series={dadosEixoII_Ranking} />
          </div>
        </div>
      </div>
    </MapProvider>
  )
}
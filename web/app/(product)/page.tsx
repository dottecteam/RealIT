import { RankingChart } from "../components/RankingChart";
import { BrasilMap } from "../components/BrasilMap";
import { mockDadosMediaRegiao } from "../mocks/score";
import FilterBar from "../components/FilterBar";
import { RankingStates } from "../components/RankingStates";
import { dadosEixoI_Ranking, dadosEixoII_Ranking, dadosEixoI_Score, dadosEixoII_Score } from "../mocks/chartData";

export default function Dashboard() {
  return (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4 px-6 bg-[#F6F6F6] min-h-[calc(100vh-80px)]">
      <div className="lg:col-span-2 flex justify-center items-start w-full">
        <div className="w-full max-w-[700px] lg:max-w-[900px]">
          <BrasilMap />
        </div>
      </div>

      <div className="lg:col-span-2 w-full flex flex-col gap-6">
        <div className="flex justify-center lg:justify-end">
          <FilterBar />
        </div>

        <div className="flex flex-col md:flex-col xl:flex-row gap-8 w-full justify-center items-stretch">
          <div className="flex-1">
            <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider">
              Média Score Eixo I
            </h2>
            <RankingChart series={dadosEixoI_Score} />
          </div>

          <div className="flex-1">
            <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider">
              Média Score Eixo II
            </h2>
            <RankingChart series={dadosEixoII_Score} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 w-full flex justify-center">
        <div className="bg-transparent rounded-[40px] pt-1 pb-10 px-4 sm:px-6 lg:px-10 w-full max-w-7xl">
    
          <h3 className="text-2xl font-black text-[#202AD0] mb-10 text-center">
            Ranking Geral por Estado
          </h3>

          <h2 className="text-center text-zinc-500 font-bold mb-1 uppercase tracking-wider">
            Ranking dos Estados Eixo I
          </h2>
          <RankingStates series={dadosEixoI_Ranking} />

          <h2 className="text-center text-zinc-500 font-bold mt-10 mb-4 uppercase tracking-wider">
            Ranking dos Estados Eixo II
          </h2>
          <RankingStates series={dadosEixoII_Ranking} />
        </div>
      </div>
    </div>
  </>
);
}
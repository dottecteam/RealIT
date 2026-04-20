import { RankingChart } from "../components/RankingChart";
import { BrasilMap } from "../components/BrasilMap";
import { mockDadosMediaRegiao } from "../mocks/score";

export default function Dashboard() {
  const dadosEixoI = mockDadosMediaRegiao.map(item => item.media_score_eixo_i);
  const dadosEixoII = mockDadosMediaRegiao.map(item => item.media_score_eixo_ii);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4 px-6 bg-[#F6F6F6] min-h-[calc(100vh-80px)] items-start">
        
        <div className="lg:col-span-2 flex justify-start items-start w-full">
          <div className="w-full max-w-[900px]">
            <BrasilMap />
          </div>
        </div>

        <div className="lg:col-span-2 w-full">
          <div className="flex flex-col xl:flex-row gap-8 w-full justify-between items-stretch">  

            <div>
              <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase text-xs tracking-wider">
                Eixo I
              </h2>
              <div className="flex-1 flex items-center justify-center w-full">
                <RankingChart pontuacoes={dadosEixoI} />
              </div>
            </div>


            <div>
              <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase text-xs tracking-wider">
                Eixo II
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <RankingChart pontuacoes={dadosEixoII} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
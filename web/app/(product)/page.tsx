// app/(product)/page.tsx
import { RankingChart } from "../components/RankingChart";
// Importação dos dados reais do seu arquivo de mocks
import { mockDadosMediaRegiao } from "../mocks/score"; 

export default function Dashboard() {
  // Extraímos os dados para o primeiro gráfico (Eixo I)
  const dadosEixoI = mockDadosMediaRegiao.map(item => item.media_score_eixo_i);
  
  // Extraímos os dados para o segundo gráfico (Eixo II)
  const dadosEixoII = mockDadosMediaRegiao.map(item => item.media_score_eixo_ii);

  return (
    <div className="flex flex-col lg:flex-row w-full items-start justify-between gap-12 mt-4 px-4 bg-[#F6F6F6] min-h-[calc(100vh-80px)]">
      
      {/* Visualização do Eixo I */}
      <div className="flex-1 w-full max-w-xl">
        <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider">
          Média Score Eixo I
        </h2>
        <RankingChart pontuacoes={dadosEixoI} />
      </div>

      {/* Visualização do Eixo II */}
      <div className="flex-1 w-full max-w-xl">
        <h2 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider">
          Média Score Eixo II
        </h2>
        <RankingChart pontuacoes={dadosEixoII} />
      </div>

    </div>
  );
}
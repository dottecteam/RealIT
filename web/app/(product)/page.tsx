// import { BrasilMap } from "../components/BrasilMap";
import { RankingChart } from "../components/RankingChart";

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-12 mt-4 px-4 bg-[#F6F6F6] min-h-[calc(100vh-80px)]">
      
      {/* <div className="flex-1 flex w-full">
        <BrasilMap />
      </div> */}

      <div className="flex-1 w-full max-w-lg">
        <RankingChart pontuacoes={[100, 210, 170, 90, 50]} />
      </div>

    </div>
  );
}
export function getCategoria(scoreI: number, scoreII: number): string {
  if (scoreI <= 2 && scoreII <= 2) return "diamante";
  if (scoreI <= 2 && scoreII >= 2 && scoreII <= 4) return "emergente";
  if (scoreI <= 2 && scoreII >= 4) return "maduro";
  if (scoreI >= 2 && scoreI <= 4 && scoreII <= 2) return "expansao";
  if (scoreI >= 2 && scoreI <= 4 && scoreII >= 2 && scoreII <= 4) return "organico";
  if (scoreI >= 2 && scoreI <= 4 && scoreII >= 4) return "defesa";
  if (scoreI >= 4 && scoreII <= 2) return "fomento";
  if (scoreI >= 4 && scoreII >= 2 && scoreII <= 4) return "retencao";
  if (scoreI >= 4 && scoreII >= 4) return "saturacao";
  return "intermediario";
}
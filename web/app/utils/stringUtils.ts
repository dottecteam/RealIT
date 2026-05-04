/**
 * Retorna as iniciais de um nome:
 * - "João Paulo" -> "JP"
 * - "João" -> "JO"
 */
export function getInitials(name: string): string {
  const names = name.trim().split(/\s+/);
  if (names.length > 1) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "USER":
      return "Membro";
    case "DEV":
      return "Desenvolvedor";
    default:
      return role;
  }
}
export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}
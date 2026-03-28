import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Página não encontrada</h2>
            <p className="text-zinc-600 mt-2 text-center">
                Ops! O conteúdo que você está procurando não existe ou foi movido.
            </p>
            <Link
                href="/"
                className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
                Voltar para o Início
            </Link>
        </div>
    );
}
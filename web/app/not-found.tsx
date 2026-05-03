import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
            <h1 className="text-6xl md:text-8xl font-black text-primary">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold mt-4 text-gray-900">Página não encontrada</h2>
            <p className="text-gray-500 mt-2 text-center max-w-md">
                Ops! O conteúdo que você está procurando não existe ou foi movido.
            </p>
            <Link
                href="/home"
                className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
                Voltar para o Início
            </Link>
        </div>
    );
}
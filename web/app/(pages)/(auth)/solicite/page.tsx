"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "../../../constants/routes";

export default function SolicitePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden animate-in fade-in duration-500">

            {/* Botão para voltar à tela de Login */}
            <button
                onClick={() => router.push(ROUTES.AUTH.LOGIN.href)}
                className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors focus:outline-none group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Voltar para o Login
            </button>

            {/* Conteúdo Principal (Página em Branco / Em breve) */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">
                    Solicitar Acesso
                </h1>
                <p className="text-gray-400 font-medium italic text-sm">
                    Em breve...
                </p>
            </div>

            {/* Círculo decorativo sutil ao fundo */}
            <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
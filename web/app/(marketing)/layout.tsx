import Link from "next/link";

// Componentes
import { Navbar } from "../components/Navbar";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {


    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            <Navbar/>

            <main className="flex-grow">
                {children}
            </main>

            {/* --- FOOTER RESPONSIVO --- */}
            <footer className="bg-white border-t border-zinc-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Grid de Links - Centralizado no Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">

                        <div className="flex flex-col items-center md:items-start col-span-1">
                            <Link href="/" className="text-2xl font-black text-primary tracking-tighter">
                                REAL IT
                            </Link>
                            <p className="mt-4 text-zinc-500 leading-relaxed max-w-xs">
                                Faça valer e investir, pois toda história merece crédito!
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-zinc-900 mb-6">Produto</h4>
                            <ul className="space-y-4 text-zinc-500">
                                <li><Link href="#" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Integrações</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Preços</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-zinc-900 mb-6">Empresa</h4>
                            <ul className="space-y-4 text-zinc-500">
                                <li><Link href="#" className="hover:text-primary transition-colors">Sobre nós</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Carreiras</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-zinc-900 mb-6">Suporte</h4>
                            <ul className="space-y-4 text-zinc-500">
                                <li><Link href="#" className="hover:text-primary transition-colors">Ajuda</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Privacidade</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Termos</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar - Centralizado no Mobile */}
                    <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center">
                        <p className="text-sm text-zinc-400">
                            © 2026 DM. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-6">
                            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                <span className="text-xs">FB</span>
                            </div>
                            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                <span className="text-xs">IG</span>
                            </div>
                            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                                <span className="text-xs">IN</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
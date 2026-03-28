"use client"; // necessário para o menu interativo

import { useState } from "react";
import Link from "next/link";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans">
            {/* --- NAVBAR --- */}
            <header className="w-full bg-primary text-white shadow-md z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    
                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-black tracking-tighter">
                        REAL <span className="text-secondary">IT</span>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-8 font-medium">
                        <Link href="/funcionalidades" className="hover:text-secondary transition-colors">Funcionalidades</Link>
                        <Link href="/sobre" className="hover:text-secondary transition-colors">Sobre nós</Link>
                        <Link href="/precos" className="hover:text-secondary transition-colors">Preços</Link>
                    </nav>

                    {/* DESKTOP ACTIONS */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="font-semibold hover:opacity-80 transition-opacity">Entrar</Link>
                        <Link href="/cadastro" className="bg-secondary text-primary px-6 py-2.5 rounded-full font-bold hover:brightness-110 transition-all active:scale-95 shadow-sm">
                            Começar agora
                        </Link>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button 
                        className="md:hidden p-2 text-secondary"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* MOBILE NAV DROPDOWN */}
                {isMenuOpen && (
                    <div className="md:hidden bg-primary-dark border-t border-white/10 p-6 space-y-4 flex flex-col items-center animate-in slide-in-from-top duration-300">
                        <Link href="/funcionalidades" className="text-lg font-medium">Funcionalidades</Link>
                        <Link href="/sobre" className="text-lg font-medium">Sobre nós</Link>
                        <Link href="/precos" className="text-lg font-medium">Preços</Link>
                        <hr className="w-full border-white/10" />
                        <Link href="/login" className="font-bold">Entrar</Link>
                        <Link href="/cadastro" className="bg-secondary text-primary w-full text-center py-3 rounded-full font-bold">
                            Começar agora
                        </Link>
                    </div>
                )}
            </header>

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
"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Menu,
    X,
    ChevronRight,
    LogIn
} from "lucide-react";

// Componentes
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Navlink } from "./Navlink";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const ROUTES = [
        { label: "Funcionalidades", route: "/funcionalidades" },
        { label: "Sobre", route: "/sobre" },
        { label: "Contato", route: "/contato" }
    ]

    return (
        <header className="w-full bg-primary text-white shadow-md z-50 sticky top-0 transition-all">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* LOGO */}
                <Logo color="white" size={28} />

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm lg:text-base">
                    {ROUTES.map((item) => (
                        <Navlink key={item.route} link={item.route}>
                            {item.label}
                        </Navlink>
                    ))}
                </nav>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex items-center gap-4">
                    <Navlink link="/login">
                        <LogIn size={20} /> Entrar
                    </Navlink>
                    <Button link="/cadastro">
                        Começar agora
                        <ChevronRight size={20} />
                    </Button>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden p-2 text-secondary hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* MOBILE NAV DROPDOWN */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary-dark border-t border-white/10 p-6 space-y-4 flex flex-col animate-in slide-in-from-top duration-300">
                    {ROUTES.map((item) => (
                        <Navlink key={item.route} link={item.route} className="text-lg justify-center">
                            {item.label}
                        </Navlink>
                    ))}

                    <hr className="border-white/10 my-2" />

                    <Navlink link="/login" className="text-lg justify-center">
                        <LogIn size={20} /> Entrar
                    </Navlink>
                    <Button link="/cadastro">
                        Começar agora
                        <ChevronRight size={20} />
                    </Button>
                </div>
            )}
        </header>
    );
}
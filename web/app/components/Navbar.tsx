"use client";

import { useState } from "react";
import { Menu, X, ChevronRight, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Navlink } from "./Navlink";
import { NAV_ROUTES, AUTH_ROUTES } from "../constants/Routes";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-primary text-white shadow-md z-50 sticky top-0 transition-all">
            <div className="container-responsive h-20 flex items-center justify-between">
                <Logo color="white" size={40}/>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex items-center gap-4 text-2xl">
                    <Navlink link={AUTH_ROUTES.login.route}>
                        <LogIn size={20} /> {AUTH_ROUTES.login.label}
                    </Navlink>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden p-2 text-secondary hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* MOBILE NAV DROPDOWN */}
            {isMenuOpen && (
                <div className="md:hidden bg-primary-dark border-t border-white/10 p-6 space-y-4 flex flex-col animate-in slide-in-from-top duration-300">

                    <div className="flex flex-col gap-4 pt-2">
                        <Navlink 
                            link={AUTH_ROUTES.login.route} 
                            className="text-lg justify-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LogIn size={20} /> {AUTH_ROUTES.login.label}
                        </Navlink>
                    </div>
                </div>
            )}
        </header>
    );
}
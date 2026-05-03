"use client";

import { useState } from "react";
import { Menu, X, ChevronRight, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Navlink } from "./Navlink";
import { NAV_ROUTES, AUTH_ROUTES } from "../constants/NavbarRoutes";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-primary text-white shadow-md z-50 sticky top-0 transition-all">
            <div className="container-responsive h-20 flex items-center justify-between">
                <Logo color="white" size={28} />

                <nav className="hidden md:flex items-center gap-8 font-medium text-sm lg:text-base">
                    {NAV_ROUTES.map((item) => (
                        <Navlink key={item.route} link={item.route}>
                            {item.label}
                        </Navlink>
                    ))}
                </nav>

                {/* DESKTOP ACTIONS */}
                <div className="hidden md:flex items-center gap-4">
                    <Navlink link={AUTH_ROUTES.login.route}>
                        <LogIn size={20} /> {AUTH_ROUTES.login.label}
                    </Navlink>
                    <Button link={AUTH_ROUTES.signup.route} className="px-5 py-2">
                        {AUTH_ROUTES.signup.label}
                        <ChevronRight size={20} />
                    </Button>
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
                    {NAV_ROUTES.map((item) => (
                        <Navlink 
                            key={item.route} 
                            link={item.route} 
                            className="text-lg justify-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Navlink>
                    ))}

                    <hr className="border-white/10 my-2" />

                    <div className="flex flex-col gap-4 pt-2">
                        <Navlink 
                            link={AUTH_ROUTES.login.route} 
                            className="text-lg justify-center py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <LogIn size={20} /> {AUTH_ROUTES.login.label}
                        </Navlink>
                        <Button 
                            link={AUTH_ROUTES.signup.route} 
                            className="w-full text-lg py-4"
                        >
                            {AUTH_ROUTES.signup.label}
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
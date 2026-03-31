import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { Sociallink } from "./Sociallink"; // Ajuste o caminho conforme sua estrutura

// Array com os dados das redes sociais
const SOCIAL_LINKS = [
    {
        id: "facebook",
        href: "https://facebook.com/suaempresa",
        icon: Facebook,
        ariaLabel: "Acessar Facebook",
    },
    {
        id: "instagram",
        href: "https://instagram.com/suaempresa",
        icon: Instagram,
        ariaLabel: "Acessar Instagram",
    },
    {
        id: "linkedin",
        href: "https://linkedin.com/company/suaempresa",
        icon: Linkedin,
        ariaLabel: "Acessar LinkedIn",
    },
];

export function Footer() {
    return (
        <footer className="bg-primary border-t border-zinc-200 py-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center md:flex-row md:justify-between gap-6">
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Logo color="white" />
                    <p className="mt-3 text-sm text-zinc-200 max-w-xs leading-relaxed">
                        Faça valer e investir, pois toda história merece crédito!
                    </p>
                </div>

                {/* Renderização dinâmica com map */}
                <div className="flex gap-4">
                    {SOCIAL_LINKS.map((social) => (
                        <Sociallink
                            key={social.id}
                            href={social.href}
                            icon={social.icon}
                            ariaLabel={social.ariaLabel}
                        />
                    ))}
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-zinc-100/20 text-center">
                <p className="text-sm text-zinc-300">
                    © 2026 DM. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
import { Logo } from "./Logo";
import { Sociallink } from "./Sociallink";
import { SOCIAL_LINKS } from "../constants/SocialLinks";


export function Footer() {
    return (
        <footer className="bg-primary border-t border-gray-200 py-10 md:py-12">
            <div className="container-responsive flex flex-col items-center md:flex-row md:justify-between gap-8">
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Logo color="white" size={28} />
                    <p className="mt-4 text-sm text-gray-200 max-w-xs leading-relaxed font-medium opacity-90">
                        Faça valer e investir, pois toda história merece crédito!
                    </p>
                </div>

                <div className="flex gap-5">
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

            <div className="container-responsive mt-10 pt-8 border-t border-white/10 text-center">
                <p className="text-xs md:text-sm text-gray-300 font-medium tracking-wide">
                    © 2026 REAL IT. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
}
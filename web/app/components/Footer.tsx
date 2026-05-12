import { Logo } from "./Logo";
import { Sociallink } from "./Sociallink";
import { SOCIAL_LINKS } from "../constants/SocialLinks";


export function Footer() {
    return (
        <footer className="bg-blue-950 border-t border-gray-200 py-10 md:py-12">
            <div className="container-responsive flex flex-col  items-center justify-center md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-center text-center">
                    <Logo color="white" size={28} />
                </div>
            </div>

            <div className="container-responsive mt-10 pt-8 border-t border-white/10 text-center">
                <p className="text-xs md:text-sm text-gray-300 font-medium tracking-wide">
                    © 2026 REAL IT. Todos os direitos reservados. | Desenvolvido por .Tec
                </p>
            </div>
        </footer>
    );
}
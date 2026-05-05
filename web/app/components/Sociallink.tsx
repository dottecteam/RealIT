import SociallinkProps from "../types/components/Sociallink";

export function Sociallink({ href, icon: Icon, ariaLabel } : SociallinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-secondary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg active:scale-90"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}
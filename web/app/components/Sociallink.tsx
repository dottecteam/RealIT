interface SociallinkProps {
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    ariaLabel: string;
}

export function Sociallink({ href, icon: Icon, ariaLabel } : SociallinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-secondary hover:text-zinc-800 hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}
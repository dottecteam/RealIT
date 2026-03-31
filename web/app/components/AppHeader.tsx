export function AppHeader() {
    return (
        <header className="h-20 border-b border-zinc-200 bg-white flex items-center justify-end px-8 gap-6 z-40">
            <button className="relative p-2.5 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-zinc-100">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-zinc-900 leading-tight">Nome do Usuário</p>
                    <p className="text-xs text-zinc-500">Membro Premium</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
                    NU
                </div>
            </div>
        </header>
    );
}
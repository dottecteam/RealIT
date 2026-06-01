"use client";

import { User } from "@/app/types/api/user";

interface UserCardProps {
    user: User;
    currentUser: User | null;
    onEdit: (user: User) => void;
    onInactivate: (id: number) => void;
    onActivate: (id: number) => void;
}

export function UserCard({ user, currentUser, onEdit, onInactivate, onActivate }: UserCardProps) {
    const isSelf = currentUser ? user.id === currentUser.id : false;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-primary flex items-center gap-2">
                            {user.name}
                            {isSelf && (
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold">
                                    Você
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                        </span>

                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => onEdit(user)}
                        className="bg-primary hover:brightness-110 active:scale-95 transition text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm"
                    >
                        Editar
                    </button>

                    {!isSelf && (
                        user.status === "ACTIVE" ? (
                            <button
                                onClick={() => onInactivate(user.id)}
                                className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition text-gray-500 px-5 py-2.5 rounded-xl text-sm font-bold"
                            >
                                Inativar
                            </button>
                        ) : (
                            <button
                                onClick={() => onActivate(user.id)}
                                className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition text-gray-500 px-5 py-2.5 rounded-xl text-sm font-bold"
                            >
                                Ativar
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
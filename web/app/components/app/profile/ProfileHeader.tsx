"use client";

import { User as UserIcon } from "lucide-react";
import { getInitials } from "../../../utils/stringUtils";

import { ROLE_LABEL, ROLE_COLOR, STATUS_COLOR } from "../../../constants/components/profileOptions";

type UserProfile = {
    id: number;
    name: string | null;
    email: string;
    role: "DEV" | "ADMIN" | "USER";
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
};


export function ProfileHeader({ user }: { user: UserProfile }) {
    const initials = getInitials(user.name || "Usuario");

    return (
        <div className="card-base bg-white shadow-sm border border-gray-100 p-6 rounded-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 bg-primary">
                    {initials}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        {user.name || "Sem nome"}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLOR[user.role]}`}>
                            {ROLE_LABEL[user.role]}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLOR[user.status]}`}>
                            {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-xs text-gray-400 font-medium shrink-0 text-center sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <span className="text-sm flex items-center gap-1.5 justify-center sm:justify-end">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        ID #{user.id}
                    </span>
                </div>
            </div>
        </div>
    );
}
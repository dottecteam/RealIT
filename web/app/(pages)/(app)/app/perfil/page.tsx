"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useApiData } from "@/app/hooks/useApiData";
import { ProfileHeader } from "@/app/components/app/profile/ProfileHeader";
import { InfoForm } from "@/app/components/app/profile/InfoForm";
import { SecurityForm } from "@/app/components/app/profile/SecurityForm";

type UserProfile = {
  id: number;
  name: string | null;
  email: string;
  role: "DEV" | "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

type Toast = { type: "success" | "error"; message: string } | null;

export default function PerfilPage() {
  const { data: user, isLoading, error } = useApiData<UserProfile>("/users/me");
  const [toast, setToast] = useState<Toast>(null);

  function triggerToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 font-medium">{error || "Usuário não encontrado."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-700 max-w-5xl mx-auto w-full py-6">

      {/* Sistema unificado de Toasts */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold border transition-all animate-in fade-in slide-in-from-top-4 ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"
          }`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}

      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">Meu Perfil</h1>
        <p className="text-gray-500 font-medium italic mt-2">Suas informações pessoais e segurança da conta.</p>
      </header>

      {/* Subcomponente do Header */}
      <ProfileHeader user={user} />

      {/* Grid com os subcomponentes isolados dos formulários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoForm
          initialName={user.name ?? ""}
          initialEmail={user.email}
          onSuccess={(msg) => triggerToast("success", msg)}
          onError={(msg) => triggerToast("error", msg)}
        />

        <SecurityForm
          onSuccess={(msg) => triggerToast("success", msg)}
          onError={(msg) => triggerToast("error", msg)}
        />
      </div>
    </div>
  );
}
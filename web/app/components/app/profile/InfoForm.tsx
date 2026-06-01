"use client";

import { useState } from "react";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { api } from "@/app/services/API/api";
import { InputField } from "@/app/components/basic/InputField";
import { Button } from "@/app/components/basic/Button";
import { API_ENDPOINTS } from "../../../constants/routes";

interface InfoFormProps {
    initialName: string;
    initialEmail: string;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function InfoForm({ initialName, initialEmail, onSuccess, onError }: InfoFormProps) {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges = name !== initialName || email !== initialEmail;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);

        try {
            await api.put(API_ENDPOINTS.USERS.ME, {
                name: name.trim() || undefined,
                email: email.trim() || undefined,
            });
            onSuccess("Informações atualizadas com sucesso!");
        } catch (err: any) {
            onError(err.response?.data?.error || "Erro ao atualizar informações.");
        } {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card-base bg-white shadow-sm border border-gray-100 p-6 flex flex-col gap-5 rounded-3xl">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Informações Pessoais</h3>
                    <p className="text-xs text-gray-400">Nome e endereço de e-mail corporativo</p>
                </div>
            </div>

            <InputField
                label="Nome completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                icon={User}
            />

            <InputField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                icon={Mail}
            />

            <Button
                type="submit"
                disabled={isSaving || !hasChanges}
                bgColor="bg-primary"
                textColor="text-white"
                className="w-full mt-auto"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Salvar alterações
                    </>
                )}
            </Button>
        </form>
    );
}
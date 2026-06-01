"use client";

import { useState } from "react";
import { Lock, Shield, Loader2 } from "lucide-react";
import { api } from "@/app/services/API/api";
import { Button } from "@/app/components/basic/Button";
import { InputField } from "@/app/components/basic/InputField";
import { API_ENDPOINTS } from "../../../constants/routes";

interface SecurityFormProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export function SecurityForm({ onSuccess, onError }: SecurityFormProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isFormInvalid =
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        newPassword !== confirmPassword;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword.length < 6) {
            return onError("A nova senha deve ter pelo menos 6 caracteres.");
        }

        setIsSaving(true);

        try {
            await api.put(API_ENDPOINTS.USERS.ME, { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            onSuccess("Senha alterada com sucesso!");
        } catch (err: any) {
            onError(err.response?.data?.error || "Erro ao alterar senha.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="card-base bg-white shadow-sm border border-gray-100 p-6 flex flex-col gap-5 rounded-3xl"
        >
            <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Segurança</h3>
                    <p className="text-xs text-gray-400">Alteração e atualização da senha</p>
                </div>
            </div>

            <div className="relative w-full">
                <InputField
                    label="Senha atual"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                />
            </div>

            <div className="relative w-full">
                <InputField
                    label="Nova senha"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    icon={Lock}
                />
            </div>

            <div className="relative w-full">
                <InputField
                    label="Confirmar nova senha"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    icon={Lock}
                />

                {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 font-medium mt-1.5 animate-in fade-in">
                        As senhas não coincidem
                    </p>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSaving || isFormInvalid}
                bgColor="bg-primary"
                textColor="text-white"
                className="w-full mt-auto"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Alterando...
                    </>
                ) : (
                    <>
                        <Shield className="w-4 h-4" />
                        Alterar senha
                    </>
                )}
            </Button>
        </form>
    );
}
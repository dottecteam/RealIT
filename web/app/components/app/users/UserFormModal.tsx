"use client";

import { useEffect, useState } from "react";
import { X, User as UserIcon, Mail, Lock, ShieldCheck } from "lucide-react";
import { InputField } from "@/app/components/basic/InputField";
import { Button } from "@/app/components/basic/Button";

interface UserFormModalProps {
    isOpen: boolean;
    editingId: number | null;
    initialData: any;
    errors: string[];
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

export function UserFormModal({ isOpen, editingId, initialData, errors, onClose, onSubmit }: UserFormModalProps) {
    const [form, setForm] = useState(initialData);

    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    function handleSubmitForm(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(form);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">

                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-primary">
                            {editingId ? "Editar Funcionário" : "Novo Funcionário"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Preencha as credenciais de acesso corporativo.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 transition flex justify-center items-center">
                        <X size={16} />
                    </button>
                </div>

                {/* Display de Erros do Backend */}
                {errors.length > 0 && (
                    <div className="px-6 pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                            <h3 className="text-red-700 font-bold mb-1 text-sm">Atenção:</h3>
                            <ul className="flex flex-col gap-0.5">
                                {errors.map((error, idx) => (
                                    <li key={idx} className="text-xs text-red-600 font-medium">• {error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Formulário com os inputs globais */}
                <form onSubmit={handleSubmitForm} className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <InputField
                            label="Nome completo"
                            type="text"
                            placeholder="Ex: João Silva"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            icon={UserIcon}
                        />

                        <InputField
                            label="E-mail Corporativo"
                            type="email"
                            placeholder="nome@empresa.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            icon={Mail}
                        />

                        <InputField
                            label="Senha"
                            type="password"
                            placeholder={editingId ? "Nova senha (opcional)" : "••••••••"}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            icon={Lock}
                        />

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide ml-1">
                                Tipo de Acesso
                            </label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 text-sm"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="USER">Usuário Comum</option>
                                    <option value="ADMIN">Administrador Master</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* Botões do Rodapé com o novo Button polimórfico */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-50 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>

                        <Button
                            type="submit"
                            bgColor="bg-primary"
                            textColor="text-white"
                            className="px-6 py-2.5 text-sm"
                        >
                            {editingId ? "Salvar alterações" : "Cadastrar usuário"}
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );
}
"use client";

import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/basic/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmModal({ isOpen, title, description, onClose, onConfirm }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden p-6 relative flex flex-col items-center text-center">

                {/* Botão de fechar no canto */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 w-8 h-8 rounded-xl hover:bg-gray-100 transition flex justify-center items-center text-gray-400 hover:text-gray-600"
                >
                    <X size={16} />
                </button>

                {/* Ícone de Alerta Semântico */}
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mt-2">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>

                {/* Textos Informativos */}
                <h3 className="text-xl font-black text-gray-950 tracking-tight mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 max-w-xs">
                    {description}
                </p>

                {/* Botões de Ação com o seu Design System */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition order-2 sm:order-1"
                    >
                        Cancelar
                    </button>

                    <Button
                        type="button"
                        onClick={onConfirm}
                        bgColor="bg-red-600 hover:bg-red-700"
                        textColor="text-white"
                        className="w-full sm:w-auto px-6 py-2.5 text-sm order-1 sm:order-2 shadow-lg shadow-red-600/10"
                    >
                        Confirmar inativação
                    </Button>
                </div>

            </div>
        </div>
    );
}
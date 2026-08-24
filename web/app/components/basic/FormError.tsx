import { AlertCircle } from "lucide-react";

interface FormErrorProps {
    message: string;
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <div className="bg-error/10 border border-error/20 text-error text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
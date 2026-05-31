import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { ComponentPropsWithoutRef, useState } from "react";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
    label: string;
    icon: LucideIcon;
}

export function InputField({ label, icon: Icon, type, ...props }: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    const currentType = isPasswordType ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 block">
                {label}
            </label>
            <div className="relative group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />

                <input
                    {...props}
                    type={currentType}
                    className={`w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 outline-none focus:bg-white focus:border-primary/20 transition-all font-medium text-gray-700 ${isPasswordType ? "pr-12" : "pr-4"
                        }`}
                />

                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
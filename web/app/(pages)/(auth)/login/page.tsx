"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "../../../components/Logo";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { signIn } from "../../../services/API/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  const validateFrontend = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido (deve conter @ e domínio)");
      return false;
    }
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateFrontend()) return;

    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push("/app");
    } catch (err: any) {
      const apiError = err.response?.data;

      if (err.response?.status === 400 && apiError.detalhes) {
        setError(apiError.detalhes[0].mensagem);
      } else if (err.response?.status === 429) {
        setError(apiError.error || "Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError(apiError?.error || "Credenciais inválidas ou erro na conexão.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center mb-10">
          <Logo size={40} color="var(--primary)" />
        </div>

        <div className="card-base bg-white shadow-2xl border border-gray-100 p-8 md:p-10">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-black text-primary tracking-tight uppercase">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Acesse sua conta para gerenciar análises.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-xs font-bold p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                E-mail Corporativo
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-primary/20 transition-all font-medium text-gray-700"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-primary/20 transition-all font-medium text-gray-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-400 font-medium">
              Não tem acesso?{" "}
              <button className="text-primary font-black hover:underline">
                Solicite ao administrador
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
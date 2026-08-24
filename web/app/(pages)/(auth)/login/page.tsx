"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "../../../components/basic/Logo";
import { InputField } from "../../../components/basic/InputField";
import { FormError } from "../../../components/basic/FormError";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "../../../services/API/authService";
import { ROUTES } from "../../../constants/routes";
import { AUTH_TOKEN_KEY } from "../../../constants/keys";
import { validateLogin } from "../../../utils/validateFields";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      router.push(ROUTES.APP.HOME.href);
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!validateLogin({ email, password, setError })) return;

    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push(ROUTES.APP.HOME.href);
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">

      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors focus:outline-none group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para o início
      </button>

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
            <FormError message={error} />

            <InputField
              label="E-mail Corporativo"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              disabled={isLoading}
              required
            />

            <InputField
              label="Senha"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />

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
              <a className="text-primary font-black hover:underline" href={ROUTES.AUTH.REQUEST.href}>
                Solicite ao administrador
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
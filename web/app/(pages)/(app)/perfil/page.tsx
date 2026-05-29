"use client"

import { useState, useEffect } from "react"
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, Save, Calendar } from "lucide-react"
import { useApiData } from "@/app/hooks/useApiData"
import { api } from "@/app/services/API/api"

type UserProfile = {
  id: number
  name: string | null
  email: string
  role: "DEV" | "ADMIN" | "USER"
  status: "ACTIVE" | "INACTIVE"
  createdAt: string
  updatedAt: string
}

type Toast = { type: "success" | "error"; message: string } | null

const ROLE_LABEL: Record<string, string> = {
  DEV: "Desenvolvedor",
  ADMIN: "Administrador",
  USER: "Usuário",
}

const ROLE_COLOR: Record<string, string> = {
  DEV: "bg-purple-100 text-purple-700",
  ADMIN: "bg-amber-100 text-amber-700",
  USER: "bg-blue-100 text-blue-700",
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-red-100 text-red-600",
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
  }
  return email[0].toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function PerfilPage() {
  const { data, isLoading, error } = useApiData<UserProfile>("/users/me")
  const [user, setUser] = useState<UserProfile | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [savingInfo, setSavingInfo] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [savingPass, setSavingPass] = useState(false)

  useEffect(() => {
    if (data) {
      setUser(data)
      setName(data.name ?? "")
      setEmail(data.email)
    }
  }, [data])

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message })

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault()

    setSavingInfo(true)

    try {
      await api.put("/users/me", {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      })

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name,
              email,
            }
          : prev
      )

      showToast("success", "Informações atualizadas com sucesso!")
    } catch (err: any) {
      showToast(
        "error",
        err.response?.data?.error || "Erro ao atualizar informações."
      )
    } finally {
      setSavingInfo(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return showToast("error", "As senhas não coincidem.")
    }

    if (newPassword.length < 6) {
      return showToast(
        "error",
        "A nova senha deve ter pelo menos 6 caracteres."
      )
    }

    setSavingPass(true)

    try {
      await api.put("/users/me", {
        currentPassword,
        newPassword,
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      showToast("success", "Senha alterada com sucesso!")
    } catch (err: any) {
      showToast(
        "error",
        err.response?.data?.error || "Erro ao alterar senha."
      )
    } finally {
      setSavingPass(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 font-medium">
          {error || "Usuário não encontrado."}
        </p>
      </div>
    )
  }

  const initials = getInitials(user.name, user.email)

  const infoChanged =
    name !== (user.name ?? "") || email !== user.email

  return (
    <div className="flex flex-col gap-8 sm:pb-15 animate-in fade-in duration-700 max-w-5xl mx-auto w-full">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}

          {toast.message}
        </div>
      )}

      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase leading-none">
            Meu Perfil
          </h1>

          <p className="text-gray-500 font-medium italic">
            Suas informações pessoais e segurança da conta.
          </p>
        </div>
      </header>

      <div className="card-base bg-white shadow-xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0"
            style={{ background: "var(--primary)" }}
          >
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {user.name || "Sem nome"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {user.email}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_COLOR[user.role]}`}>
                {ROLE_LABEL[user.role]}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLOR[user.status]}`}>
                {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs text-gray-500 font-medium shrink-0 text-right">
            <span className="text-[14px] flex items-center gap-1.5 justify-end">
              <Calendar className="w-4.5 h-4.5" />
              Desde {formatDate(user.createdAt)}
            </span>
            <span className="text-[14px] flex items-center gap-1.5 justify-end">
              <User className="w-4.5 h-4.5" />
              ID #{user.id}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleInfoSubmit}
          className="card-base bg-white shadow-xl p-6 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                Informações Pessoais
              </h3>

              <p className="text-xs text-gray-400">
                Nome e endereço de e-mail
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              Nome completo
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              E-mail
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingInfo || !infoChanged}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            style={{ background: "var(--primary)" }}
          >
            {savingInfo ? (
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
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="card-base bg-white shadow-xl p-6 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>

            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                Segurança
              </h3>

              <p className="text-xs text-gray-400">
                Alteração da senha
              </p>
            </div>
          </div>

          <PasswordInput
            label="Senha atual"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
            placeholder="••••••••"
          />

          <PasswordInput
            label="Nova senha"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
            placeholder="Mínimo 6 caracteres"
          />

          <PasswordInput
            label="Confirmar nova senha"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            placeholder="Repita a nova senha"
            error={
              confirmPassword && newPassword !== confirmPassword ? "As senhas não coincidem" : undefined
            }
          />

          <button
            type="submit"
            disabled={
              savingPass ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            style={{ background: "var(--primary)" }}
          >
            {savingPass ? (
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
          </button>
        </form>
      </div>
    </div>
  )
}

function PasswordInput({ label, value, onChange, show, onToggle, placeholder, error }: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
  placeholder?: string
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 focus:ring-primary/30 focus:border-primary"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
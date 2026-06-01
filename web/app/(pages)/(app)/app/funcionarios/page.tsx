"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUsers, createUser, updateUser, inactivateUser, activateUser, getProfile } from "../../../../services/API/userService";
import { UserCard } from "@/app/components/app/users/UserCard";
import { UserFormModal } from "@/app/components/app/users/UserFormModal";
import { ConfirmModal } from "@/app/components/basic/ConfirmModal";
import { User, UserRole, UserStatus } from "@/app/types/api/user";

interface FormState {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const INITIAL_FORM_STATE: FormState = {
  name: "",
  email: "",
  password: "",
  role: "USER",
  status: "ACTIVE",
};

export default function FuncionariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userIdToInactivate, setUserIdToInactivate] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const router = useRouter();

  async function loadUsers() {
    try {
      const data = await getUsers();
      if (!data || (data as any).error || !Array.isArray(data)) {
        router.push("/app");
        return;
      }
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initializePage() {
      try {
        setIsLoading(true);
        const profileData = await getProfile();
        const profile = profileData as User;

        if (profile.role !== "ADMIN") {
          router.push("/app");
          return;
        }

        const data = await getUsers();

        if (mounted && Array.isArray(data)) {
          setCurrentUser(profile);
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initializePage();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleFormSubmit(formData: FormState) {
    setErrors([]);
    try {
      if (editingId) {
        const payload: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        if (formData.password.trim() !== "") {
          payload.password = formData.password;
        }

        const response = await updateUser(editingId, payload);
        handleApiResponse(response, "Erro ao atualizar usuário");
      } else {
        const response = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        handleApiResponse(response, "Erro ao cadastrar usuário");
      }
    } catch (error) {
      console.error(error);
      setErrors(["Erro inesperado ao salvar usuário"]);
    }
  }

  function handleApiResponse(response: any, fallbackError: string) {
    if (response?.error) {
      const detalhes = response?.data?.detalhes;
      if (detalhes) {
        setErrors(detalhes.map((item: any) => item.mensagem));
      } else {
        setErrors([fallbackError]);
      }
    } else {
      setForm(INITIAL_FORM_STATE);
      setEditingId(null);
      setIsModalOpen(false);
      loadUsers();
    }
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setErrors([]);
    setIsModalOpen(true);
  }

  function handleInactivateRequest(id: number) {
    setUserIdToInactivate(id);
    setIsConfirmOpen(true);
  }

  async function handleConfirmInactivate() {
    if (userIdToInactivate) {
      await inactivateUser(userIdToInactivate);
      setIsConfirmOpen(false);
      setUserIdToInactivate(null);
      loadUsers();
    }
  }

  async function handleActivate(id: number) {
    await activateUser(id);
    loadUsers();
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(INITIAL_FORM_STATE);
    setErrors([]);
    setIsModalOpen(true);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-gray-400 text-xs italic font-medium animate-pulse">
          Validando credenciais administrativas...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
            Funcionários
          </h1>
          <p className="text-gray-500 font-medium text-sm italic mt-2">
            Mapeamento e controle de acessos administrativos do Real IT.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-primary hover:brightness-110 transition-all text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-primary/10"
        >
          + Novo Funcionário
        </button>
      </header>

      {users.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
          <h2 className="text-lg font-bold text-primary">Nenhum colaborador na base</h2>
          <p className="text-gray-400 text-sm mt-1">Clique em "Novo Funcionário" para liberar o primeiro acesso.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              onEdit={handleEdit}
              onInactivate={handleInactivateRequest}
              onActivate={handleActivate}
            />
          ))}
        </div>
      )}

      {/* Modal de Formulário */}
      <UserFormModal
        isOpen={isModalOpen}
        editingId={editingId}
        initialData={form}
        errors={errors}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* 💎 MODAL DE CONFIRMAÇÃO DE INATIVAÇÃO PERSONALIZADO */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Inativar Funcionário?"
        description="Esta ação revogará imediatamente todos os acessos do colaborador às matrizes e dados estratégicos do sistema."
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmInactivate}
      />
    </div>
  );
}
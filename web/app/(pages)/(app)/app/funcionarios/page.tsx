"use client";

import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  inactivateUser,
} from "../../../../services/API/useService";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function FuncionariosPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function fetchUsers() {
      try {
        if (!mounted) return;

        const data = await getUsers();

        if (!mounted) return;

        setUsers(data);
      } catch (error: any) {
        console.error(error?.response?.data || error);
      }
    }

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }

      setForm({
        name: "",
        email: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });

      setEditingId(null);

      setIsModalOpen(false);

      loadUsers();
    } catch (error) {
      console.error(error);
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

    setIsModalOpen(true);
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm(
      "Deseja inativar este usuário?"
    );

    if (!confirmDelete) return;

    await inactivateUser(id);

    loadUsers();
  }

  function openCreateModal() {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    });

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-8 sm:pb-15 animate-in fade-in duration-700">

      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-gray-100 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
            Funcionários
          </h1>

          <p className="text-gray-500 font-medium flex items-center gap-2 italic">
            Gerencie os usuários cadastrados no sistema.
          </p>
        </div>
      </header>

      <div className="rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 justify-end items-start sm:items-center">
        <button
          onClick={openCreateModal}
          className="bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          + Novo Funcionário
        </button>
      </div>

      <div className="rounded-3xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4">

          {users.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center">

              <h2 className="text-xl font-black text-primary">
                Nenhum usuário encontrado
              </h2>

              <p className="text-gray-500 mt-2">
                Cadastre um novo funcionário para começar.
              </p>

            </div>
          )}

  {users.map((user) => (
    <div
      key={user.id}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-primary">
                {user.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {user.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <span className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-sm font-bold">
                {user.role}
              </span>

              <span
                className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                  user.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="bg-primary transition text-white px-5 py-3 rounded-[15px] font-bold"
              onClick={() => handleEdit(user)}
            >
              Editar
            </button>

            <button
              className="bg-white hover:bg-gray-100 hover:text-primary shadow-sm transition text-gray-500 px-5 py-3 rounded-[15px] font-bold"
              onClick={() => handleDelete(user.id)}
            >
              Inativar
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-primary">
                  {editingId
                    ? "Editar Funcionário"
                    : "Novo Funcionário"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Preencha os dados abaixo.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                className="border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nome"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <input
                type="password"
                className="border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={
                  editingId
                    ? "Nova senha (opcional)"
                    : "Senha"
                }
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <select
                className="border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20"
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-2xl border border-gray-200 font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>

                <button
                  className="bg-primary text-white px-5 py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-primary/20"
                  type="submit"
                >
                  {editingId
                    ? "Salvar alterações"
                    : "Cadastrar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
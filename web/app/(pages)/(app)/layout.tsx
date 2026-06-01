"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/layout/Sidebar";
import { AppHeader } from "../../components/layout/AppHeader";
import { Loader2 } from "lucide-react";
import { getRoleLabel } from "@/app/utils/stringUtils";
import { ROUTES } from "../../constants/routes";
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from "../../constants/keys";
import { DataProvider } from "../../contexts/DataContext";

export default function ProdutoLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const roleLabel = getRoleLabel(user?.role || "");

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userDataStr = localStorage.getItem(USER_DATA_KEY);

    if (!token) {
      router.push(ROUTES.AUTH.LOGIN.href);
    } else {
      if (userDataStr) {
        try {
          setUser(JSON.parse(userDataStr));
        } catch (error) {
          console.error("Erro ao parsear dados do usuário:", error);
        }
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DataProvider> {/* 👈 Blindando as páginas internas com o cache de dados */}
      <div className="flex h-screen bg-background font-sans overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <AppHeader userName={user?.name} userRole={roleLabel} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-background pb-24 md:pb-8">
            <div className="container-responsive">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
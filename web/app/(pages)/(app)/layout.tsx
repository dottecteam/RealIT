"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/Sidebar";
import { AppHeader } from "../../components/AppHeader";
import { getRoleLabel } from "@/app/utils/stringUtils";

export default function ProdutoLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const roleLabel = getRoleLabel(user?.role || "");

  useEffect(() => {
    const token = localStorage.getItem('@RealIT:token');
    const userDataStr = localStorage.getItem('@RealIT:user');

    if (!token) {
      router.push('/login');
    } else {
      if (userDataStr) {
        setUser(JSON.parse(userDataStr));
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="h-screen w-full bg-background flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  return (
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
  );
}
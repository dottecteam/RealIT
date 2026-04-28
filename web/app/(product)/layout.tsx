"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/AppHeader";

export default function ProdutoLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F6F6F6] pb-20 md:pb-8">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
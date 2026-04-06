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
        <main className="flex-1 overflow-y-auto p-8 bg-[#F6F6F6]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
import type { ReactNode } from "react";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-layout">
      <AppHeader />

      <div className="app-body">
        <Sidebar />

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
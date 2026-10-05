import { useState } from "react";
import type { ReactNode } from "react";

import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";

import { CategoriesPage } from "../pages/CategoriesPage";
import { CustomersPage } from "../pages/CustomersPage";
import { DashboardPage } from "../pages/DashboardPage";
import { InventoryPage } from "../pages/InventoryPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SalesPage } from "../pages/SalesPage";
import { SettingsPage } from "../pages/SettingsPage";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children,
}: MainLayoutProps) {
  const [currentPage, setCurrentPage] =
    useState("Productos");

  function renderPage() {
    if (currentPage === "Dashboard") {
      return <DashboardPage />;
    }

    if (currentPage === "Productos") {
      return <ProductsPage />;
    }

    if (currentPage === "Categorías") {
      return <CategoriesPage />;
    }

    if (currentPage === "Inventario") {
      return <InventoryPage />;
    }

    if (currentPage === "Ventas") {
      return <SalesPage />;
    }

    if (currentPage === "Clientes") {
      return <CustomersPage />;
    }

    if (currentPage === "Reportes") {
      return <ReportsPage />;
    }

    if (currentPage === "Configuración") {
      return <SettingsPage />;
    }

    return children;
  }

  return (
    <div className="app-layout">
      <AppHeader />

      <div className="app-body">
        <Sidebar onNavigate={setCurrentPage} />

        <main className="app-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
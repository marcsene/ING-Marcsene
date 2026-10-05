import { useState } from "react";

interface SidebarProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  "Dashboard",
  "Productos",
  "Categorías",
  "Inventario",
  "Ventas",
  "Clientes",
  "Reportes",
  "Configuración",
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const [activePage, setActivePage] = useState("Productos");

  function handleNavigate(page: string) {
    setActivePage(page);
    onNavigate(page);
  }

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            className={`sidebar-link ${
              activePage === item ? "active" : ""
            }`}
            key={item}
            type="button"
            onClick={() => handleNavigate(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
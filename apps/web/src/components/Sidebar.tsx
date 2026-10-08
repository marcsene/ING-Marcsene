import { useState } from "react";
import logoIcon from "../assets/brand/ing-marcsene-icon.png";

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
      <div className="sidebar-brand">
        <img
          src={logoIcon}
          alt="ING.Marcsene"
          className="sidebar-brand-icon"
        />
      </div>

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
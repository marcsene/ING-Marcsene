const menuItems = [
  "Dashboard",
  "Productos",
  "Inventario",
  "Ventas",
  "Clientes",
  "Reportes",
  "Configuración",
];

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a className="sidebar-link" href="#" key={item}>
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}
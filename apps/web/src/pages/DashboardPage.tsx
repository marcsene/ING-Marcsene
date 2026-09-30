
const stats = [
  { label: "Ventas del mes", value: "$0" },
  { label: "Productos", value: "0" },
  { label: "Stock bajo", value: "0" },
  { label: "Clientes", value: "0" },
];

export function DashboardPage() {
  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <p>Resumen general de tu negocio.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
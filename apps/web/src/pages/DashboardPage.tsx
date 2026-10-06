import { useEffect, useState } from "react";

import { getCustomers } from "../services/api/customersApi";
import { getProducts } from "../services/api/productsApi";

export function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [products, customers] = await Promise.all([
          getProducts(),
          getCustomers(),
        ]);

        setProductCount(products.length);
        setCustomerCount(customers.length);

        const lowStockProducts = products.filter(
          (product) => product.stock <= 5,
        );

        setLowStockCount(lowStockProducts.length);
      } catch {
        setError("No se pudieron cargar los datos del Dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="dashboard">
        <div className="dashboard-heading">
          <h1>Dashboard</h1>
          <p>Cargando información...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard">
        <div className="dashboard-heading">
          <h1>Dashboard</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Ventas del mes", value: "$0" },
    { label: "Productos", value: productCount.toString() },
    { label: "Stock bajo", value: lowStockCount.toString() },
    { label: "Clientes", value: customerCount.toString() },
  ];

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
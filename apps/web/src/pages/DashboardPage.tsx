import { useEffect, useState } from "react";

import { getCustomers } from "../services/api/customersApi";
import { getProducts } from "../services/api/productsApi";
import type { Product } from "@ing-marcsene/types";

interface DashboardStat {
  label: string;
  value: string;
  icon: string;
  description: string;
  variant: "primary" | "success" | "warning" | "info";
}

export function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
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

        const productsWithLowStock = products.filter(
          (product) => product.stock <= 5,
        );

        setLowStockProducts(productsWithLowStock);
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

  const stats: DashboardStat[] = [
    {
      label: "Ventas del mes",
      value: "$0",
      icon: "$",
      description: "Sin ventas registradas",
      variant: "primary",
    },
    {
      label: "Productos",
      value: productCount.toString(),
      icon: "P",
      description: "Productos registrados",
      variant: "info",
    },
    {
      label: "Stock bajo",
      value: lowStockProducts.length.toString(),
      icon: "!",
      description: "Requieren atención",
      variant: "warning",
    },
    {
      label: "Clientes",
      value: customerCount.toString(),
      icon: "C",
      description: "Clientes registrados",
      variant: "success",
    },
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de tu negocio.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article
            className={`stat-card stat-card-${stat.variant}`}
            key={stat.label}
          >
            <div className="stat-card-top">
              <div className="stat-icon">{stat.icon}</div>
              <span>{stat.label}</span>
            </div>

            <strong>{stat.value}</strong>

            <p>{stat.description}</p>
          </article>
        ))}
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Alertas de inventario</h2>
            <p>Productos que requieren atención.</p>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="dashboard-empty">
            <span>✓</span>
            <div>
              <strong>Inventario en buen estado</strong>
              <p>No hay productos con stock bajo.</p>
            </div>
          </div>
        ) : (
          <div className="low-stock-list">
            {lowStockProducts.map((product) => (
              <article className="low-stock-item" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category_name || "Sin categoría"}</span>
                </div>

                <div className="low-stock-value">
                  <strong>{product.stock}</strong>
                  <span>unidades</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
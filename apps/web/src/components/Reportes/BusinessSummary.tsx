
import { useEffect, useState } from "react";

import { getBusinessSummary } from "../../services/api/reportsApi";

type BusinessSummaryData = Awaited<
  ReturnType<typeof getBusinessSummary>
>;

export function BusinessSummary() {
  const [data, setData] = useState<BusinessSummaryData>({
    sales: 0,
    saleCount: 0,
    averageSale: 0,
    products: 0,
    activeProducts: 0,
    stockUnits: 0,
    lowStock: 0,
    customers: 0,
    inventoryValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const summary = await getBusinessSummary();
        setData(summary);
      } catch {
        setError("No se pudo cargar el resumen del negocio.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (loading) {
    return (
      <section className="report-summary-section">
        <div className="report-summary-heading">
          <h2>Resumen del negocio</h2>
          <p>Cargando información...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="report-summary-section">
        <div className="report-summary-heading">
          <h2>Resumen del negocio</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  const formatNumber = (value: number) =>
    value.toLocaleString("es-CL");

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("es-CL", {
      maximumFractionDigits: 0,
    })}`;

  const stats = [
    { icon: "💰", label: "Ingresos", value: formatCurrency(data.sales) },
    { icon: "📈", label: "Ventas", value: formatNumber(data.saleCount) },
    { icon: "🎫", label: "Ticket promedio", value: formatCurrency(data.averageSale) },
    { icon: "🛍️", label: "Productos", value: formatNumber(data.products) },
    { icon: "📦", label: "Stock disponible", value: formatNumber(data.stockUnits) },
    { icon: "⚠️", label: "Stock bajo", value: formatNumber(data.lowStock) },
    { icon: "👥", label: "Clientes", value: formatNumber(data.customers) },
    { icon: "💼", label: "Valor inventario", value: formatCurrency(data.inventoryValue) },
  ];

  return (
    <section className="report-summary-section">
      <div className="report-summary-heading">
        <div>
          <h2>Resumen del negocio</h2>
          <p>Principales indicadores de tu negocio.</p>
        </div>
      </div>

      <div className="report-summary-grid">
        {stats.map((stat) => (
          <article
            className="report-summary-stat"
            key={stat.label}
          >
            <span>{stat.icon}</span>
            <div>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

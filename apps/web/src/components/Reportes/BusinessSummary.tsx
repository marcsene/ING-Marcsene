import { useEffect, useState } from "react";

import { getCustomers } from "../../services/api/customersApi";
import { getProducts } from "../../services/api/productsApi";
import { getSales } from "../../services/api/salesApi";

interface BusinessSummaryData {
  sales: number;
  saleCount: number;
  averageSale: number;
  products: number;
  activeProducts: number;
  stockUnits: number;
  lowStock: number;
  customers: number;
  inventoryValue: number;
}

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
        const [products, customers, sales] =
          await Promise.all([
            getProducts(),
            getCustomers(),
            getSales(),
          ]);

        const completedSales = sales.filter(
          (sale) => sale.status === "completed",
        );

        const totalSales = completedSales.reduce(
          (total, sale) =>
            total + Number(sale.total),
          0,
        );

        const stockUnits = products.reduce(
          (total, product) =>
            total + product.stock,
          0,
        );

        const inventoryValue = products.reduce(
          (total, product) =>
            total +
            Number(product.price) *
              product.stock,
          0,
        );

        const lowStock = products.filter(
          (product) => product.stock <= 5,
        ).length;

        const activeProducts = products.filter(
          (product) => product.active,
        ).length;

        setData({
          sales: totalSales,
          saleCount: completedSales.length,
          averageSale:
            completedSales.length > 0
              ? totalSales /
                completedSales.length
              : 0,
          products: products.length,
          activeProducts,
          stockUnits,
          lowStock,
          customers: customers.length,
          inventoryValue,
        });
      } catch {
        setError(
          "No se pudo cargar el resumen del negocio.",
        );
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

          <p>
            Cargando información...
          </p>
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

  return (
    <section className="report-summary-section">
      <div className="report-summary-heading">
        <div>
          <h2>Resumen del negocio</h2>

          <p>
            Principales indicadores de tu negocio.
          </p>
        </div>
      </div>

      <div className="report-summary-grid">
        <article className="report-summary-stat">
          <span>💰</span>

          <div>
            <small>Ingresos</small>

            <strong>
              $
              {data.sales.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>📈</span>

          <div>
            <small>Ventas</small>

            <strong>
              {data.saleCount.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>🎫</span>

          <div>
            <small>Ticket promedio</small>

            <strong>
              $
              {data.averageSale.toLocaleString(
                "es-CL",
                {
                  maximumFractionDigits: 0,
                },
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>🛍️</span>

          <div>
            <small>Productos</small>

            <strong>
              {data.products.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>📦</span>

          <div>
            <small>Stock disponible</small>

            <strong>
              {data.stockUnits.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>⚠️</span>

          <div>
            <small>Stock bajo</small>

            <strong>
              {data.lowStock.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>👥</span>

          <div>
            <small>Clientes</small>

            <strong>
              {data.customers.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="report-summary-stat">
          <span>💼</span>

          <div>
            <small>Valor inventario</small>

            <strong>
              $
              {data.inventoryValue.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>
      </div>
    </section>
  );
}
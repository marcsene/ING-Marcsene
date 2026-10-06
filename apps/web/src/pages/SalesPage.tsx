import { useEffect, useState } from "react";

import { getCustomers } from "../services/api/customersApi";
import { getProducts } from "../services/api/productsApi";
import { getSales, type Sale } from "../services/api/salesApi";
import { NewSaleForm } from "../components/sales/NewSaleForm";

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customerNames, setCustomerNames] = useState<Record<number, string>>(
    {},
  );
  const [productNames, setProductNames] = useState<Record<number, string>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewSale, setShowNewSale] = useState(false);

  useEffect(() => {
    async function loadSales() {
      try {
        const [salesData, customers, products] = await Promise.all([
          getSales(),
          getCustomers(),
          getProducts(),
        ]);

        const customersMap: Record<number, string> = {};

        customers.forEach((customer) => {
          customersMap[customer.id] = customer.name;
        });

        const productsMap: Record<number, string> = {};

        products.forEach((product) => {
          productsMap[Number(product.id)] = product.name;
        });

        setSales(salesData);
        setCustomerNames(customersMap);
        setProductNames(productsMap);
      } catch {
        setError("No se pudieron cargar las ventas.");
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  if (showNewSale) {
    return (
      <section className="sales-page">
        <NewSaleForm
          onCancel={() => setShowNewSale(false)}
          onCreated={() => {
            setShowNewSale(false);
            window.location.reload();
          }}
        />
      </section>
    );
  }

  if (loading) {
    return (
      <section className="sales-page">
        <div className="page-heading">
          <div>
            <h1>Ventas</h1>
            <p>Gestiona las ventas realizadas por tu negocio.</p>
          </div>
        </div>

        <div className="module-empty-state">
          <h2>Cargando ventas...</h2>
          <p>Estamos obteniendo las ventas registradas.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sales-page">
        <div className="page-heading">
          <div>
            <h1>Ventas</h1>
            <p>Gestiona las ventas realizadas por tu negocio.</p>
          </div>
        </div>

        <div className="module-empty-state">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sales-page">
      <div className="page-heading">
        <div>
          <h1>Ventas</h1>

          <p>Gestiona las ventas realizadas por tu negocio.</p>
        </div>

        <button type="button" onClick={() => setShowNewSale(true)}>
          Nueva venta
        </button>
      </div>

      {sales.length === 0 ? (
        <div className="module-empty-state">
          <h2>No hay ventas registradas</h2>

          <p>Cuando registres una venta aparecerá aquí.</p>
        </div>
      ) : (
        <div className="sales-list">
          {sales.map((sale) => (
            <article className="sales-card" key={sale.id}>
              <div className="sales-card-header">
                <div>
                  <strong>Venta #{sale.id}</strong>

                  <span>
                    {customerNames[sale.customer] || "Cliente no encontrado"}
                  </span>
                </div>

                <strong className="sales-total">
                  ${Number(sale.total).toLocaleString("es-CL")}
                </strong>
              </div>

              <div className="sales-card-items">
                {sale.items.map((item) => (
                  <div className="sales-item" key={item.id}>
                    <span>
                      {productNames[item.product] || item.product_name}
                    </span>

                    <span>
                      {item.quantity} × $
                      {Number(item.unit_price).toLocaleString("es-CL")}
                    </span>

                    <strong>
                      ${Number(item.subtotal).toLocaleString("es-CL")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="sales-card-footer">
                <span>{new Date(sale.created_at).toLocaleString("es-CL")}</span>

                <span className="sale-status">
                  {sale.status === "completed" ? "Completada" : sale.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

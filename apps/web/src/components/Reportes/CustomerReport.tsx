import { useEffect, useState } from "react";
import { getCustomers } from "../../services/api/customersApi";
import type { Customer } from "../../services/api/customersApi";

export function CustomerReport() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomers();
        setCustomers(data);
      } catch {
        setError("No se pudo cargar la información de los clientes.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const activeCustomers = customers.filter(
    (customer) => customer.active,
  );

  const inactiveCustomers = customers.filter(
    (customer) => !customer.active,
  );

  if (loading) {
    return (
      <section className="customer-report">
        <div className="report-section-heading">
          <h2>Reporte de clientes</h2>
          <p>Cargando información de los clientes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="customer-report">
        <div className="report-section-heading">
          <h2>Reporte de clientes</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="customer-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de clientes</h2>
          <p>
            Consulta el estado y la información de tus clientes.
          </p>
        </div>
      </div>

      <div className="customer-report-summary">
        <article className="customer-report-stat">
          <span>👥</span>
          <div>
            <small>Total clientes</small>
            <strong>{customers.length}</strong>
          </div>
        </article>

        <article className="customer-report-stat">
          <span>✅</span>
          <div>
            <small>Clientes activos</small>
            <strong>{activeCustomers.length}</strong>
          </div>
        </article>

        <article className="customer-report-stat">
          <span>🔒</span>
          <div>
            <small>Clientes inactivos</small>
            <strong>{inactiveCustomers.length}</strong>
          </div>
        </article>
      </div>

      <div className="customer-report-table-wrapper">
        <div className="customer-report-table">
          <div className="customer-report-row customer-report-header">
            <span>CLIENTE</span>
            <span>EMAIL</span>
            <span>TELÉFONO</span>
            <span>DIRECCIÓN</span>
            <span>ESTADO</span>
          </div>

          {customers.map((customer) => (
            <div
              className="customer-report-row"
              key={customer.id}
            >
              <span>{customer.name}</span>
              <span>{customer.email || "—"}</span>
              <span>{customer.phone || "—"}</span>
              <span>{customer.address || "—"}</span>
              <span>
                {customer.active ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))}

          {customers.length === 0 && (
            <div className="customer-report-empty">
              No hay clientes registrados.
            </div>
          )}
        </div>
      </div>

      <div className="customer-report-footer">
        <strong>
          Clientes activos: {activeCustomers.length}
        </strong>

        <span>
          Clientes inactivos: {inactiveCustomers.length}
        </span>
      </div>
    </section>
  );
}
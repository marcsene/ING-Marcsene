
import { useEffect, useState } from "react";

import {
  getCustomers,
  type Customer,
} from "../../services/api/customersApi";

import { exportToExcel } from "../../utils/reportsExport";

export function CustomerReport() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
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

  const inactiveCount = customers.length - activeCustomers.length;

  const formatNumber = (value: number) =>
    value.toLocaleString("es-CL");

  function handleExport() {
    setExportError("");

    if (customers.length === 0) {
      setExportError("No hay clientes para exportar.");
      return;
    }

    try {
      const rows = customers.map((customer) => ({
        Cliente: customer.name,
        Email: customer.email || "",
        Teléfono: customer.phone || "",
        Dirección: customer.address || "",
        Estado: customer.active ? "Activo" : "Inactivo",
      }));

      exportToExcel(
        `clientes-${new Date().toISOString().slice(0, 10)}`,
        "Clientes",
        rows,
      );
    } catch {
      setExportError("No se pudo generar el archivo Excel.");
    }
  }

  if (loading || error) {
    return (
      <section className="customer-report">
        <div className="report-section-heading">
          <h2>Reporte de clientes</h2>
          <p>
            {loading
              ? "Cargando información de los clientes..."
              : error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="customer-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de clientes</h2>
          <p>Consulta el estado y la información de tus clientes.</p>
        </div>

        <button type="button" onClick={handleExport}>
          📥 Exportar a Excel
        </button>
      </div>

      {exportError && <p role="alert">{exportError}</p>}

      <div className="customer-report-summary">
        <article className="customer-report-stat">
          <span>👥</span>
          <div>
            <small>Total clientes</small>
            <strong>{formatNumber(customers.length)}</strong>
          </div>
        </article>

        <article className="customer-report-stat">
          <span>✅</span>
          <div>
            <small>Clientes activos</small>
            <strong>{formatNumber(activeCustomers.length)}</strong>
          </div>
        </article>

        <article className="customer-report-stat">
          <span>🔒</span>
          <div>
            <small>Clientes inactivos</small>
            <strong>{formatNumber(inactiveCount)}</strong>
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
            <div className="customer-report-row" key={customer.id}>
              <span>{customer.name}</span>
              <span>{customer.email || "—"}</span>
              <span>{customer.phone || "—"}</span>
              <span>{customer.address || "—"}</span>
              <span>{customer.active ? "Activo" : "Inactivo"}</span>
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
          Clientes activos: {formatNumber(activeCustomers.length)}
        </strong>
        <span>
          Clientes inactivos: {formatNumber(inactiveCount)}
        </span>
      </div>
    </section>
  );
}

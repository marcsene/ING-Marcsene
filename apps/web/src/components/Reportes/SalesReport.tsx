
import { useEffect, useMemo, useState } from "react";

import { getCustomers } from "../../services/api/customersApi";
import { getSales, type Sale } from "../../services/api/salesApi";
import { exportToExcel } from "../../utils/reportsExport";
import { ReportPeriodFilter } from "./ReportPeriodFilter";

interface Customer {
  id: number;
  name: string;
}

export function SalesReport() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const [salesData, customerData] = await Promise.all([
          getSales(),
          getCustomers(),
        ]);

        setSales(salesData);
        setCustomers(
          customerData.map((customer) => ({
            id: Number(customer.id),
            name: customer.name,
          })),
        );
      } catch {
        setError("No se pudo cargar el reporte de ventas.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const filteredSales = useMemo(() => {
    const now = new Date();

    return sales.filter((sale) => {
      const date = new Date(sale.created_at);

      if (Number.isNaN(date.getTime())) return false;

      if (period === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (period === "7days" || period === "30days") {
        const days = period === "7days" ? 7 : 30;
        const from = new Date(now);
        from.setDate(from.getDate() - days);

        return date >= from && date <= now;
      }

      if (period === "month") {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        );
      }

      if (period === "custom") {
        if (startDate && date < new Date(`${startDate}T00:00:00`)) {
          return false;
        }

        if (endDate && date > new Date(`${endDate}T23:59:59.999`)) {
          return false;
        }
      }

      return true;
    });
  }, [sales, period, startDate, endDate]);

  const completedSales = filteredSales.filter(
    (sale) => sale.status === "completed",
  );

  const totalSales = completedSales.reduce(
    (total, sale) => total + Number(sale.total),
    0,
  );

  const averageSale = completedSales.length
    ? totalSales / completedSales.length
    : 0;

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("es-CL", {
      maximumFractionDigits: 0,
    })}`;

  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  );

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });

  function handleExport() {
    setExportError("");

    if (filteredSales.length === 0) {
      setExportError("No hay ventas para exportar en este período.");
      return;
    }

    try {
      const rows = filteredSales.map((sale) => ({
        Venta: `Venta #${sale.id}`,
        Cliente:
          customerNames.get(Number(sale.customer)) ??
          `Cliente #${sale.customer}`,
        Fecha: formatDate(sale.created_at),
        Estado:
          sale.status === "completed"
            ? "Completada"
            : sale.status === "pending"
              ? "Pendiente"
              : "Anulada",
        Total: Number(sale.total),
      }));

      exportToExcel(
        `ventas-${period}-${new Date().toISOString().slice(0, 10)}`,
        "Ventas",
        rows,
      );
    } catch {
      setExportError("No se pudo generar el archivo Excel.");
    }
  }

  if (loading) {
    return (
      <section className="sales-report">
        <div className="report-section-heading">
          <h2>Reporte de ventas</h2>
          <p>Cargando información...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sales-report">
        <div className="report-section-heading">
          <h2>Reporte de ventas</h2>
          <p role="alert">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sales-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de ventas</h2>
          <p>Consulta las ventas registradas en tu negocio.</p>
        </div>

        <button type="button" onClick={handleExport}>
          📥 Exportar a Excel
        </button>
      </div>

      <ReportPeriodFilter
        value={period}
        startDate={startDate}
        endDate={endDate}
        onChange={setPeriod}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {exportError && <p role="alert">{exportError}</p>}

      <div className="sales-report-summary">
        <article className="sales-report-stat">
          <span>💰</span>
          <div>
            <small>Ingresos de ventas completadas</small>
            <strong>{formatCurrency(totalSales)}</strong>
          </div>
        </article>

        <article className="sales-report-stat">
          <span>📈</span>
          <div>
            <small>Ventas completadas</small>
            <strong>{completedSales.length.toLocaleString("es-CL")}</strong>
          </div>
        </article>

        <article className="sales-report-stat">
          <span>🎫</span>
          <div>
            <small>Ticket promedio</small>
            <strong>{formatCurrency(averageSale)}</strong>
          </div>
        </article>
      </div>

      <div className="sales-report-table-wrapper">
        <div className="sales-report-table-heading">
          <div>
            <h3>Detalle de ventas</h3>
            <p>
              {filteredSales.length.toLocaleString("es-CL")} registros en el
              período seleccionado.
            </p>
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="report-empty">
            <span>—</span>
            <div>
              <strong>No hay ventas en este período</strong>
              <p>Prueba seleccionando otro período.</p>
            </div>
          </div>
        ) : (
          <div className="sales-report-table">
            <div className="sales-report-row sales-report-header">
              <span>Venta</span>
              <span>Cliente</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Total</span>
            </div>

            {filteredSales.map((sale) => (
              <div className="sales-report-row" key={sale.id}>
                <span>Venta #{sale.id}</span>
                <span>
                  {customerNames.get(Number(sale.customer)) ??
                    `Cliente #${sale.customer}`}
                </span>
                <span>{formatDate(sale.created_at)}</span>
                <span>
                  {sale.status === "completed"
                    ? "Completada"
                    : sale.status === "pending"
                      ? "Pendiente"
                      : "Anulada"}
                </span>
                <strong>{formatCurrency(Number(sale.total))}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

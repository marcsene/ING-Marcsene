import { useEffect, useState } from "react";

import { getCustomers } from "../../services/api/customersApi";
import { getSales, type Sale } from "../../services/api/salesApi";
import { ReportPeriodFilter } from "./ReportPeriodFilter";

interface Customer {
  id: number;
  name: string;
}

export function SalesReport() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [period, setPeriod] = useState("all");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadSalesReport() {
      try {
        const [salesData, customerData] =
          await Promise.all([
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
        setError(
          "No se pudo cargar el reporte de ventas.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSalesReport();
  }, []);

  if (loading) {
    return (
      <section className="sales-report">
        <div className="report-section-heading">
          <h2>Reporte de ventas</h2>

          <p>
            Cargando información...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="sales-report">
        <div className="report-section-heading">
          <h2>Reporte de ventas</h2>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  const now = new Date();

  function filterByPeriod(sale: Sale) {
    const saleDate = new Date(
      sale.created_at,
    );

    if (period === "all") {
      return true;
    }

    if (period === "today") {
      return (
        saleDate.getFullYear() ===
          now.getFullYear() &&
        saleDate.getMonth() ===
          now.getMonth() &&
        saleDate.getDate() ===
          now.getDate()
      );
    }

    if (period === "7days") {
      const selectedStart = new Date(now);

      selectedStart.setDate(
        selectedStart.getDate() - 7,
      );

      return saleDate >= selectedStart;
    }

    if (period === "30days") {
      const selectedStart = new Date(now);

      selectedStart.setDate(
        selectedStart.getDate() - 30,
      );

      return saleDate >= selectedStart;
    }

    if (period === "month") {
      return (
        saleDate.getFullYear() ===
          now.getFullYear() &&
        saleDate.getMonth() ===
          now.getMonth()
      );
    }

    if (period === "custom") {
      if (!startDate && !endDate) {
        return true;
      }

      if (startDate) {
        const selectedStart = new Date(
          `${startDate}T00:00:00`,
        );

        if (saleDate < selectedStart) {
          return false;
        }
      }

      if (endDate) {
        const selectedEnd = new Date(
          `${endDate}T23:59:59.999`,
        );

        if (saleDate > selectedEnd) {
          return false;
        }
      }

      return true;
    }

    return true;
  }

  const filteredSales = sales.filter(
    filterByPeriod,
  );

  const completedSales =
    filteredSales.filter(
      (sale) =>
        sale.status === "completed",
    );

  const totalSales =
    completedSales.reduce(
      (total, sale) =>
        total + Number(sale.total),
      0,
    );

  const averageSale =
    completedSales.length > 0
      ? totalSales /
        completedSales.length
      : 0;

  function getCustomerName(
    customerId: number,
  ) {
    return (
      customers.find(
        (customer) =>
          customer.id === customerId,
      )?.name ||
      `Cliente #${customerId}`
    );
  }

  function formatDate(date: string) {
    return new Date(
      date,
    ).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <section className="sales-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de ventas</h2>

          <p>
            Consulta el comportamiento de
            las ventas registradas.
          </p>
        </div>
      </div>

      <ReportPeriodFilter
        value={period}
        startDate={startDate}
        endDate={endDate}
        onChange={setPeriod}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      <div className="sales-report-summary">
        <article className="sales-report-stat">
          <span>💰</span>

          <div>
            <small>
              Ingresos totales
            </small>

            <strong>
              $
              {totalSales.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="sales-report-stat">
          <span>📈</span>

          <div>
            <small>
              Ventas completadas
            </small>

            <strong>
              {completedSales.length.toLocaleString(
                "es-CL",
              )}
            </strong>
          </div>
        </article>

        <article className="sales-report-stat">
          <span>🎫</span>

          <div>
            <small>
              Ticket promedio
            </small>

            <strong>
              $
              {averageSale.toLocaleString(
                "es-CL",
                {
                  maximumFractionDigits: 0,
                },
              )}
            </strong>
          </div>
        </article>
      </div>

      <div className="sales-report-table-wrapper">
        <div className="sales-report-table-heading">
          <div>
            <h3>
              Detalle de ventas
            </h3>

            <p>
              Ventas registradas en el
              período seleccionado.
            </p>
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="report-empty">
            <span>—</span>

            <div>
              <strong>
                No hay ventas en este
                período
              </strong>

              <p>
                Prueba seleccionando
                otro período.
              </p>
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

            {filteredSales.map(
              (sale) => (
                <div
                  className="sales-report-row"
                  key={sale.id}
                >
                  <span>
                    Venta #{sale.id}
                  </span>

                  <span>
                    {getCustomerName(
                      sale.customer,
                    )}
                  </span>

                  <span>
                    {formatDate(
                      sale.created_at,
                    )}
                  </span>

                  <span>
                    {sale.status ===
                    "completed"
                      ? "Completada"
                      : sale.status ===
                          "pending"
                        ? "Pendiente"
                        : "Anulada"}
                  </span>

                  <strong>
                    $
                    {Number(
                      sale.total,
                    ).toLocaleString(
                      "es-CL",
                    )}
                  </strong>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
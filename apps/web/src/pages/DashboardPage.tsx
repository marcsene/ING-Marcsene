import { useEffect, useState } from "react";

import { getCustomers } from "../services/api/customersApi";
import { getProducts } from "../services/api/productsApi";
import { getSales } from "../services/api/salesApi";
import type { Product } from "@ing-marcsene/types";

interface DashboardStat {
  label: string;
  value: string;
  icon: string;
  description: string;
  variant: "primary" | "success" | "warning" | "info";
}

interface SaleItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: number | string;
  subtotal: number | string;
}

interface Sale {
  id: number;
  customer: number;
  status: string;
  total: number | string;
  created_at: string;
  items: SaleItem[];
}

export function DashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [activeProductCount, setActiveProductCount] =
    useState(0);
  const [inactiveProductCount, setInactiveProductCount] =
    useState(0);

  const [lowStockProducts, setLowStockProducts] =
    useState<Product[]>([]);

  const [totalStockUnits, setTotalStockUnits] =
    useState(0);

  const [inventoryValue, setInventoryValue] =
    useState(0);

  const [customerCount, setCustomerCount] =
    useState(0);

  const [monthlySales, setMonthlySales] =
    useState(0);

  const [monthlySaleCount, setMonthlySaleCount] =
    useState(0);

  const [todaySales, setTodaySales] =
    useState(0);

  const [todaySaleCount, setTodaySaleCount] =
    useState(0);

  const [topProduct, setTopProduct] =
    useState("Sin ventas");

  const [topProductQuantity, setTopProductQuantity] =
    useState(0);

  const [recentSales, setRecentSales] =
    useState<Sale[]>([]);

  const [customers, setCustomers] =
    useState<
      {
        id: number;
        name: string;
      }[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          products,
          customerData,
          salesData,
        ] = await Promise.all([
          getProducts(),
          getCustomers(),
          getSales(),
        ]);

        const sales =
          salesData as Sale[];

        /*
         * CLIENTES
         */

        setCustomerCount(
          customerData.length,
        );

        setCustomers(
          customerData.map((customer) => ({
            id: Number(customer.id),
            name: customer.name,
          })),
        );

        /*
         * PRODUCTOS
         */

        setProductCount(
          products.length,
        );

        const activeProducts =
          products.filter(
            (product) => product.active,
          );

        const inactiveProducts =
          products.filter(
            (product) => !product.active,
          );

        setActiveProductCount(
          activeProducts.length,
        );

        setInactiveProductCount(
          inactiveProducts.length,
        );

        /*
         * STOCK
         */

        const productsWithLowStock =
          products.filter(
            (product) => product.stock <= 5,
          );

        setLowStockProducts(
          productsWithLowStock,
        );

        const stockUnits =
          products.reduce(
            (total, product) =>
              total + product.stock,
            0,
          );

        setTotalStockUnits(
          stockUnits,
        );

        /*
         * VALOR DEL INVENTARIO
         */

        const stockValue =
          products.reduce(
            (total, product) =>
              total +
              Number(product.price) *
                product.stock,
            0,
          );

        setInventoryValue(
          stockValue,
        );

        /*
         * FECHA ACTUAL
         */

        const now = new Date();

        const currentYear =
          now.getFullYear();

        const currentMonth =
          now.getMonth();

        const currentDay =
          now.getDate();

        /*
         * VENTAS COMPLETADAS
         */

        const completedSales =
          sales.filter(
            (sale) =>
              sale.status ===
              "completed",
          );

        /*
         * VENTAS DEL MES
         */

        const completedSalesThisMonth =
          completedSales.filter(
            (sale) => {
              const saleDate =
                new Date(
                  sale.created_at,
                );

              return (
                saleDate.getFullYear() ===
                  currentYear &&
                saleDate.getMonth() ===
                  currentMonth
              );
            },
          );

        const salesThisMonth =
          completedSalesThisMonth.reduce(
            (total, sale) =>
              total +
              Number(sale.total),
            0,
          );

        setMonthlySales(
          salesThisMonth,
        );

        setMonthlySaleCount(
          completedSalesThisMonth.length,
        );

        /*
         * VENTAS DE HOY
         */

        const completedSalesToday =
          completedSales.filter(
            (sale) => {
              const saleDate =
                new Date(
                  sale.created_at,
                );

              return (
                saleDate.getFullYear() ===
                  currentYear &&
                saleDate.getMonth() ===
                  currentMonth &&
                saleDate.getDate() ===
                  currentDay
              );
            },
          );

        const salesToday =
          completedSalesToday.reduce(
            (total, sale) =>
              total +
              Number(sale.total),
            0,
          );

        setTodaySales(
          salesToday,
        );

        setTodaySaleCount(
          completedSalesToday.length,
        );

        /*
         * PRODUCTO MÁS VENDIDO
         */

        const productSales: Record<
          string,
          {
            name: string;
            quantity: number;
          }
        > = {};

        completedSales.forEach(
          (sale) => {
            sale.items.forEach(
              (item) => {
                const productId =
                  String(
                    item.product,
                  );

                if (
                  !productSales[
                    productId
                  ]
                ) {
                  productSales[
                    productId
                  ] = {
                    name:
                      item.product_name,
                    quantity: 0,
                  };
                }

                productSales[
                  productId
                ].quantity +=
                  item.quantity;
              },
            );
          },
        );

        const topProductEntry =
          Object.values(
            productSales,
          ).sort(
            (a, b) =>
              b.quantity -
              a.quantity,
          )[0];

        if (topProductEntry) {
          setTopProduct(
            topProductEntry.name,
          );

          setTopProductQuantity(
            topProductEntry.quantity,
          );
        }

        /*
         * ÚLTIMAS VENTAS
         */

        setRecentSales(
          sales.slice(0, 5),
        );
      } catch {
        setError(
          "No se pudieron cargar los datos del Dashboard.",
        );
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

          <p>
            Cargando información...
          </p>
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

  /*
   * TICKET PROMEDIO
   */

  const averageTicket =
    monthlySaleCount > 0
      ? monthlySales /
        monthlySaleCount
      : 0;

  /*
   * ESTADÍSTICAS
   */

  const commercialStats: DashboardStat[] = [
    {
      label: "Ventas del mes",
      value: `$${monthlySales.toLocaleString(
        "es-CL",
      )}`,
      icon: "$",
      description:
        "Ingresos registrados este mes",
      variant: "primary",
    },
    {
      label: "Operaciones",
      value:
        monthlySaleCount.toString(),
      icon: "V",
      description:
        "Ventas completadas este mes",
      variant: "success",
    },
    {
      label: "Ticket promedio",
      value: `$${averageTicket.toLocaleString(
        "es-CL",
        {
          maximumFractionDigits: 0,
        },
      )}`,
      icon: "T",
      description:
        "Promedio por venta",
      variant: "info",
    },
    {
      label: "Ventas de hoy",
      value: `$${todaySales.toLocaleString(
        "es-CL",
      )}`,
      icon: "H",
      description:
        todaySaleCount > 0
          ? `${todaySaleCount} operación(es) hoy`
          : "Sin ventas hoy",
      variant: "primary",
    },
  ];

  const inventoryStats: DashboardStat[] = [
    {
      label: "Productos",
      value:
        productCount.toString(),
      icon: "P",
      description:
        "Productos registrados",
      variant: "info",
    },
    {
      label: "Clientes",
      value:
        customerCount.toString(),
      icon: "C",
      description:
        "Clientes registrados",
      variant: "success",
    },
    {
      label: "Stock bajo",
      value:
        lowStockProducts.length.toString(),
      icon: "!",
      description:
        lowStockProducts.length > 0
          ? "Requieren atención"
          : "Inventario en buen estado",
      variant: "warning",
    },
    {
      label: "Unidades",
      value:
        totalStockUnits.toLocaleString(
          "es-CL",
        ),
      icon: "I",
      description:
        "Unidades disponibles",
      variant: "info",
    },
  ];

  const productStats: DashboardStat[] = [
    {
      label: "Valor inventario",
      value: `$${inventoryValue.toLocaleString(
        "es-CL",
      )}`,
      icon: "$",
      description:
        "Valor según precio actual",
      variant: "primary",
    },
    {
      label: "Productos activos",
      value:
        activeProductCount.toString(),
      icon: "A",
      description:
        "Disponibles para venta",
      variant: "success",
    },
    {
      label: "Productos inactivos",
      value:
        inactiveProductCount.toString(),
      icon: "X",
      description:
        "No disponibles",
      variant: "warning",
    },
    {
      label: "Más vendido",
      value: topProduct,
      icon: "★",
      description:
        topProductQuantity > 0
          ? `${topProductQuantity} unidades vendidas`
          : "Sin ventas registradas",
      variant: "success",
    },
  ];

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

  function formatDate(
    date: string,
  ) {
    return new Date(
      date,
    ).toLocaleString(
      "es-CL",
      {
        dateStyle: "short",
        timeStyle: "short",
      },
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Resumen general de tu negocio.
          </p>
        </div>
      </div>

      {/* RESUMEN COMERCIAL */}

      <section className="dashboard-group">
        <div className="dashboard-group-heading">
          <div>
            <h2>
              Resumen comercial
            </h2>

            <p>
              Rendimiento de las ventas.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {commercialStats.map(
            (stat) => (
              <article
                className={`stat-card stat-card-${stat.variant}`}
                key={stat.label}
              >
                <div className="stat-card-top">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span>
                    {stat.label}
                  </span>
                </div>

                <strong>
                  {stat.value}
                </strong>

                <p>
                  {stat.description}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* INVENTARIO */}

      <section className="dashboard-group">
        <div className="dashboard-group-heading">
          <div>
            <h2>
              Inventario
            </h2>

            <p>
              Estado actual del inventario.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {inventoryStats.map(
            (stat) => (
              <article
                className={`stat-card stat-card-${stat.variant}`}
                key={stat.label}
              >
                <div className="stat-card-top">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span>
                    {stat.label}
                  </span>
                </div>

                <strong>
                  {stat.value}
                </strong>

                <p>
                  {stat.description}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}

      <section className="dashboard-group">
        <div className="dashboard-group-heading">
          <div>
            <h2>
              Productos destacados
            </h2>

            <p>
              Información comercial de tus productos.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          {productStats.map(
            (stat) => (
              <article
                className={`stat-card stat-card-${stat.variant}`}
                key={stat.label}
              >
                <div className="stat-card-top">
                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span>
                    {stat.label}
                  </span>
                </div>

                <strong>
                  {stat.value}
                </strong>

                <p>
                  {stat.description}
                </p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* ALERTAS DE INVENTARIO */}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>
              Alertas de inventario
            </h2>

            <p>
              Productos que requieren atención.
            </p>
          </div>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="dashboard-empty">
            <span>✓</span>

            <div>
              <strong>
                Inventario en buen estado
              </strong>

              <p>
                No hay productos con stock bajo.
              </p>
            </div>
          </div>
        ) : (
          <div className="low-stock-list">
            {lowStockProducts.map(
              (product) => (
                <article
                  className="low-stock-item"
                  key={product.id}
                >
                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category_name ||
                        "Sin categoría"}
                    </span>
                  </div>

                  <div className="low-stock-value">
                    <strong>
                      {product.stock}
                    </strong>

                    <span>
                      unidades
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      {/* ÚLTIMAS VENTAS */}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>
              Últimas ventas
            </h2>

            <p>
              Actividad comercial reciente.
            </p>
          </div>
        </div>

        {recentSales.length === 0 ? (
          <div className="dashboard-empty">
            <span>—</span>

            <div>
              <strong>
                No hay ventas registradas
              </strong>

              <p>
                Las nuevas ventas aparecerán aquí.
              </p>
            </div>
          </div>
        ) : (
          <div className="recent-sales-list">
            {recentSales.map(
              (sale) => (
                <article
                  className="recent-sale-item"
                  key={sale.id}
                >
                  <div className="recent-sale-main">
                    <strong>
                      Venta #{sale.id}
                    </strong>

                    <span>
                      {getCustomerName(
                        sale.customer,
                      )}
                    </span>
                  </div>

                  <div className="recent-sale-products">
                    {sale.items
                      .map(
                        (item) =>
                          `${item.product_name} × ${item.quantity}`,
                      )
                      .join(", ")}
                  </div>

                  <div className="recent-sale-total">
                    <strong>
                      $
                      {Number(
                        sale.total,
                      ).toLocaleString(
                        "es-CL",
                      )}
                    </strong>

                    <span>
                      {formatDate(
                        sale.created_at,
                      )}
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </section>
  );
}
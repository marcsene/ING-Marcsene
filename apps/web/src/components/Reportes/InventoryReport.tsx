
import { useEffect, useState } from "react";
import type { Product } from "@ing-marcsene/types";

import { getProducts } from "../../services/api/productsApi";
import { exportToExcel } from "../../utils/reportsExport";

const LOW_STOCK_LIMIT = 5;

export function InventoryReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("No se pudo cargar la información del inventario.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.stock),
    0,
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= LOW_STOCK_LIMIT,
  );

  const activeProducts = products.filter((product) => product.active);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("es-CL", {
      maximumFractionDigits: 0,
    })}`;

  function handleExport() {
    setExportError("");

    if (products.length === 0) {
      setExportError("No hay productos para exportar.");
      return;
    }

    try {
      const rows = products.map((product) => ({
        Producto: product.name,
        Categoría: product.category_name || "Sin categoría",
        Precio: Number(product.price),
        Stock: Number(product.stock),
        Estado: !product.active
          ? "Inactivo"
          : product.stock <= LOW_STOCK_LIMIT
            ? "Stock bajo"
            : "Disponible",
        "Valor del inventario":
          Number(product.price) * Number(product.stock),
      }));

      exportToExcel(
        `inventario-${new Date().toISOString().slice(0, 10)}`,
        "Inventario",
        rows,
      );
    } catch {
      setExportError("No se pudo generar el archivo Excel.");
    }
  }

  if (loading || error) {
    return (
      <section className="inventory-report">
        <div className="report-section-heading">
          <h2>Reporte de inventario</h2>
          <p>
            {loading
              ? "Cargando información del inventario..."
              : error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="inventory-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de inventario</h2>
          <p>Consulta el estado y disponibilidad de los productos.</p>
        </div>

        <button type="button" onClick={handleExport}>
          📥 Exportar a Excel
        </button>
      </div>

      {exportError && <p role="alert">{exportError}</p>}

      <div className="inventory-report-summary">
        <article className="inventory-report-stat">
          <span>📦</span>
          <div>
            <small>Productos registrados</small>
            <strong>{products.length.toLocaleString("es-CL")}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>📊</span>
          <div>
            <small>Unidades disponibles</small>
            <strong>{totalUnits.toLocaleString("es-CL")}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>⚠️</span>
          <div>
            <small>Productos con stock bajo</small>
            <strong>{lowStockProducts.length.toLocaleString("es-CL")}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>💰</span>
          <div>
            <small>Valor al precio de venta</small>
            <strong>{formatCurrency(inventoryValue)}</strong>
          </div>
        </article>
      </div>

      <div className="inventory-report-table-wrapper">
        <div className="inventory-report-table">
          <div className="inventory-report-row inventory-report-header">
            <span>PRODUCTO</span>
            <span>CATEGORÍA</span>
            <span>PRECIO</span>
            <span>STOCK</span>
            <span>ESTADO</span>
          </div>

          {products.map((product) => (
            <div className="inventory-report-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.category_name || "Sin categoría"}</span>
              <span>{formatCurrency(Number(product.price))}</span>
              <span>{Number(product.stock).toLocaleString("es-CL")}</span>
              <span>
                {!product.active
                  ? "Inactivo"
                  : product.stock <= LOW_STOCK_LIMIT
                    ? "Stock bajo"
                    : "Disponible"}
              </span>
            </div>
          ))}

          {products.length === 0 && (
            <div className="inventory-report-empty">
              No hay productos registrados.
            </div>
          )}
        </div>
      </div>

      <div className="inventory-report-footer">
        <strong>Productos activos: {activeProducts.length}</strong>
        <span>Productos con stock bajo: {lowStockProducts.length}</span>
      </div>
    </section>
  );
}

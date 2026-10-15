
import { useEffect, useState } from "react";
import type { Product } from "@ing-marcsene/types";

import { getProducts } from "../../services/api/productsApi";
import { exportToExcel } from "../../utils/reportsExport";

export function ProductReport() {
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
        setError("No se pudo cargar la información de los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const activeProducts = products.filter((product) => product.active);
  const inactiveProducts = products.length - activeProducts.length;

  const totalUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const totalPrice = products.reduce(
    (total, product) => total + Number(product.price),
    0,
  );

  const averagePrice = products.length
    ? totalPrice / products.length
    : 0;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.stock),
    0,
  );

  const formatNumber = (value: number) =>
    value.toLocaleString("es-CL");

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
        Estado: product.active ? "Activo" : "Inactivo",
        "Valor del inventario":
          Number(product.price) * Number(product.stock),
      }));

      exportToExcel(
        `productos-${new Date().toISOString().slice(0, 10)}`,
        "Productos",
        rows,
      );
    } catch {
      setExportError("No se pudo generar el archivo Excel.");
    }
  }

  if (loading || error) {
    return (
      <section className="product-report">
        <div className="report-section-heading">
          <h2>Reporte de productos</h2>
          <p>
            {loading
              ? "Cargando información de los productos..."
              : error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de productos</h2>
          <p>Consulta el estado y la información de tus productos.</p>
        </div>

        <button type="button" onClick={handleExport}>
          📥 Exportar a Excel
        </button>
      </div>

      {exportError && <p role="alert">{exportError}</p>}

      <div className="product-report-summary">
        <article className="product-report-stat">
          <span>🛍️</span>
          <div>
            <small>Total productos</small>
            <strong>{formatNumber(products.length)}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>✅</span>
          <div>
            <small>Productos activos</small>
            <strong>{formatNumber(activeProducts.length)}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>📦</span>
          <div>
            <small>Unidades disponibles</small>
            <strong>{formatNumber(totalUnits)}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>💰</span>
          <div>
            <small>Precio promedio</small>
            <strong>{formatCurrency(averagePrice)}</strong>
          </div>
        </article>
      </div>

      <div className="product-report-table-wrapper">
        <div className="product-report-table">
          <div className="product-report-row product-report-header">
            <span>PRODUCTO</span>
            <span>CATEGORÍA</span>
            <span>PRECIO</span>
            <span>STOCK</span>
            <span>ESTADO</span>
          </div>

          {products.map((product) => (
            <div className="product-report-row" key={product.id}>
              <span>{product.name}</span>
              <span>{product.category_name || "Sin categoría"}</span>
              <span>{formatCurrency(Number(product.price))}</span>
              <span>{formatNumber(Number(product.stock))}</span>
              <span>{product.active ? "Activo" : "Inactivo"}</span>
            </div>
          ))}

          {products.length === 0 && (
            <div className="product-report-empty">
              No hay productos registrados.
            </div>
          )}
        </div>
      </div>

      <div className="product-report-footer">
        <strong>Productos activos: {activeProducts.length}</strong>
        <span>Productos inactivos: {inactiveProducts}</span>
        <span>
          Valor estimado del inventario: {formatCurrency(inventoryValue)}
        </span>
      </div>
    </section>
  );
}

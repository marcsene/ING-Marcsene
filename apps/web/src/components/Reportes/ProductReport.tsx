import { useEffect, useState } from "react";
import { getProducts } from "../../services/api/productsApi";
import type { Product } from "@ing-marcsene/types";

export function ProductReport() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

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

  const activeProducts = products.filter(
    (product) => product.active,
  );

  const inactiveProducts = products.filter(
    (product) => !product.active,
  );

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const averagePrice =
    products.length > 0
      ? products.reduce(
          (total, product) => total + Number(product.price),
          0,
        ) / products.length
      : 0;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.stock * Number(product.price),
    0,
  );

  if (loading) {
    return (
      <section className="product-report">
        <div className="report-section-heading">
          <h2>Reporte de productos</h2>
          <p>Cargando información de los productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-report">
        <div className="report-section-heading">
          <h2>Reporte de productos</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de productos</h2>
          <p>
            Consulta el estado y la información de tus productos.
          </p>
        </div>
      </div>

      <div className="product-report-summary">
        <article className="product-report-stat">
          <span>🛍️</span>
          <div>
            <small>Total productos</small>
            <strong>{products.length}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>✅</span>
          <div>
            <small>Productos activos</small>
            <strong>{activeProducts.length}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>📦</span>
          <div>
            <small>Unidades disponibles</small>
            <strong>{totalUnits}</strong>
          </div>
        </article>

        <article className="product-report-stat">
          <span>💰</span>
          <div>
            <small>Precio promedio</small>
            <strong>
              ${averagePrice.toLocaleString("es-CL")}
            </strong>
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
            <div
              className="product-report-row"
              key={product.id}
            >
              <span>{product.name}</span>

              <span>
                {product.category_name || "Sin categoría"}
              </span>

              <span>
                ${Number(product.price).toLocaleString("es-CL")}
              </span>

              <span>{product.stock}</span>

              <span>
                {product.active ? "Activo" : "Inactivo"}
              </span>
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
        <strong>
          Productos activos: {activeProducts.length}
        </strong>

        <span>
          Productos inactivos: {inactiveProducts.length}
        </span>

        <span>
          Valor inventario: $
          {inventoryValue.toLocaleString("es-CL")}
        </span>
      </div>
    </section>
  );
}
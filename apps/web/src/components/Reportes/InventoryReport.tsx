import { useEffect, useState } from "react";
import { getProducts } from "../../services/api/productsApi";
import type { Product } from "@ing-marcsene/types";

export function InventoryReport() {
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
        setError("No se pudo cargar la información del inventario.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.stock * product.price,
    0,
  );

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5,
  );

  const activeProducts = products.filter(
    (product) => product.active,
  );

  if (loading) {
    return (
      <section className="inventory-report">
        <div className="report-section-heading">
          <h2>Reporte de inventario</h2>
          <p>Cargando información del inventario...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="inventory-report">
        <div className="report-section-heading">
          <h2>Reporte de inventario</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="inventory-report">
      <div className="report-section-heading">
        <div>
          <h2>Reporte de inventario</h2>
          <p>
            Consulta el estado y disponibilidad de los productos.
          </p>
        </div>
      </div>

      <div className="inventory-report-summary">
        <article className="inventory-report-stat">
          <span>📦</span>
          <div>
            <small>Productos</small>
            <strong>{products.length}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>📊</span>
          <div>
            <small>Unidades disponibles</small>
            <strong>{totalUnits}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>⚠️</span>
          <div>
            <small>Stock bajo</small>
            <strong>{lowStockProducts.length}</strong>
          </div>
        </article>

        <article className="inventory-report-stat">
          <span>💰</span>
          <div>
            <small>Valor inventario</small>
            <strong>
              ${inventoryValue.toLocaleString("es-CL")}
            </strong>
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
            <div
              className="inventory-report-row"
              key={product.id}
            >
              <span>{product.name}</span>

              <span>
                {product.category_name || "Sin categoría"}
              </span>

              <span>
                ${Number(inventoryValue).toLocaleString("es-CL")}
              </span>

              <span>{product.stock}</span>

              <span>
                {product.stock <= 5
                  ? "Stock bajo"
                  : product.active
                    ? "Disponible"
                    : "Inactivo"}
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
        <strong>
          Productos activos: {activeProducts.length}
        </strong>

        <span>
          Productos con stock bajo: {lowStockProducts.length}
        </span>
      </div>
    </section>
  );
}
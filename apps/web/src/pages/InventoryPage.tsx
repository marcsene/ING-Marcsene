import { useEffect, useState } from "react";

import type { Product } from "@ing-marcsene/types";

import { getProducts } from "../services/api/productsApi";

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch {
        setError("No se pudo cargar el inventario.");
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  if (loading) {
    return (
      <section className="inventory-page">
        <p>Cargando inventario...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="inventory-page">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="inventory-page">
      <div className="page-heading">
        <div>
          <h1>Inventario</h1>

          <p>
            Consulta y controla el stock de tus productos.
          </p>
        </div>
      </div>

      <div className="inventory-list">
        {products.map((product) => (
          <article
            className="inventory-card"
            key={product.id}
          >
            <div>
              <h2>{product.name}</h2>

              <span>
                {product.category_name ?? "Sin categoría"}
              </span>
            </div>

            <div>
              <strong>{product.stock}</strong>

              <span>unidades</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
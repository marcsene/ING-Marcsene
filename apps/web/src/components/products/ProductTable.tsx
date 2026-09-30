import type { Product } from "@ing-marcsene/types";

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="products-table">
      <div className="products-table-header">
        <span>Producto</span>
        <span>Categoría</span>
        <span>Precio</span>
        <span>Stock</span>
        <span>Estado</span>
        <span>Acciones</span>
      </div>

      {products.map((product) => (
        <div className="products-table-row" key={product.id}>
          <span>{product.name}</span>
          <span>{product.categoryId}</span>
          <span>${product.price}</span>
          <span>{product.stock}</span>

          <span
            className={`product-status ${
              product.active
                ? "product-status-active"
                : "product-status-inactive"
            }`}
          >
            {product.active ? "Activo" : "Inactivo"}
          </span>

          <div className="product-actions">
            <button type="button">Editar</button>
            <button type="button">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
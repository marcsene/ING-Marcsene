import type { Product } from "@ing-marcsene/types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number | string) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
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
          <span>{product.category_name}</span>
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
            <button type="button" onClick={() => onEdit(product)}>
              Editar
            </button>

            <button type="button" onClick={() => onDelete(product.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

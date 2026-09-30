import { useState } from "react";
import type { Product } from "@ing-marcsene/types";

interface ProductFormProps {
  product?: Product;
  onCancel: () => void;
  onSubmit: (product: Product) => void;
}

export function ProductForm({
  product,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");

  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? "",
  );

  const [price, setPrice] = useState(
    product?.price.toString() ?? "",
  );

  const [stock, setStock] = useState(
    product?.stock.toString() ?? "",
  );

  const [active, setActive] = useState(
    product?.active ? "true" : "false",
  );

  const isEditing = Boolean(product);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const updatedProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),
      name,
      categoryId,
      price: Number(price),
      stock: Number(stock),
      active: active === "true",
    };

    onSubmit(updatedProduct);
  }

  return (
    <section className="product-form">
      <div className="product-form-header">
        <h2>
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h2>

        <p>
          {isEditing
            ? "Modifica la información del producto."
            : "Ingresa la información del nuevo producto."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>

          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            required
          >
            <option value="">
              Seleccionar categoría
            </option>

            <option value="alimentos">
              Alimentos
            </option>

            <option value="bebidas">
              Bebidas
            </option>

            <option value="limpieza">
              Limpieza
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio</label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock</label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="active">Estado</label>

          <select
            id="active"
            name="active"
            value={active}
            onChange={(event) => setActive(event.target.value)}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button type="submit">
            {isEditing
              ? "Guardar cambios"
              : "Guardar producto"}
          </button>
        </div>
      </form>
    </section>
  );
}
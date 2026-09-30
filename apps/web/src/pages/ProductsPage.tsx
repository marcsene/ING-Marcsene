import { useState } from "react";
import type { Product } from "@ing-marcsene/types";
import { ProductForm } from "../components/products/ProductForm";
import { ProductTable } from "../components/products/ProductTable";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Arroz 1 Kg",
    categoryId: "alimentos",
    price: 1500,
    stock: 25,
    active: true,
  },
  {
    id: "2",
    name: "Coca-Cola 1.5 L",
    categoryId: "bebidas",
    price: 1800,
    stock: 12,
    active: true,
  },
  {
    id: "3",
    name: "Detergente 1 Kg",
    categoryId: "limpieza",
    price: 3990,
    stock: 4,
    active: true,
  },
  {
    id: "4",
    name: "Pan Molde",
    categoryId: "alimentos",
    price: 2200,
    stock: 18,
    active: true,
  },
];

export function ProductsPage() {
  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  function handleCreateProduct(product: Product) {
    setProducts((currentProducts) => [
      ...currentProducts,
      product,
    ]);

    setShowForm(false);
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleUpdateProduct(product: Product) {
    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id
          ? product
          : currentProduct,
      ),
    );

    setEditingProduct(null);
    setShowForm(false);
  }

  function handleDeleteProduct(productId: string) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?",
    );

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId,
      ),
    );
  }

  function handleCancelForm() {
    setEditingProduct(null);
    setShowForm(false);
  }

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct ?? undefined}
        onCancel={handleCancelForm}
        onSubmit={
          editingProduct
            ? handleUpdateProduct
            : handleCreateProduct
        }
      />
    );
  }

  return (
    <section className="products-page">
      <div className="page-heading">
        <div>
          <h1>Productos</h1>
          <p>Administra los productos de tu negocio.</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Nuevo producto
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </section>
  );
}
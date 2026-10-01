import { useEffect, useState } from "react";
import type { Product } from "@ing-marcsene/types";

import { ProductForm } from "../components/products/ProductForm";
import { ProductTable } from "../components/products/ProductTable";
import {
  createProduct,
  getProducts,
} from "../services/api/productsApi";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data);
      } catch {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleCreateProduct(product: Product) {
    try {
      const createdProduct = await createProduct(product);

      setProducts((currentProducts) => [
        ...currentProducts,
        createdProduct,
      ]);

      setShowForm(false);
    } catch {
      setError("No se pudo crear el producto.");
    }
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

  function handleDeleteProduct(productId: number | string) {
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

  if (loading) {
    return (
      <section className="products-page">
        <p>Cargando productos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="products-page">
        <p>{error}</p>
      </section>
    );
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
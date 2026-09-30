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

  if (showForm) {
    return (
      <ProductForm
        onCancel={() => setShowForm(false)}
        onSubmit={(product) => {
          setProducts((currentProducts) => [
            ...currentProducts,
            product,
          ]);

          setShowForm(false);
        }}
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
          onClick={() => setShowForm(true)}
        >
          Nuevo producto
        </button>
      </div>

      <ProductTable products={products} />
    </section>
  );
}
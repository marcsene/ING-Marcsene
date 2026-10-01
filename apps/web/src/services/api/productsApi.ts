import type { Product } from "@ing-marcsene/types";

const API_URL = "http://127.0.0.1:8000/api";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/`);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  return response.json();
}

export async function createProduct(
  product: Omit<Product, "id" | "category_name">,
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el producto.");
  }

  return response.json();
}
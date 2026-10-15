
import type { Product } from "@ing-marcsene/types";
import { apiFetch } from "./apiClient";

export interface Category {
  id: number;
  name: string;
  active: boolean;
}

export async function getProducts(): Promise<Product[]> {
  const response = await apiFetch("/products/");

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos.");
  }

  return response.json();
}

export async function createProduct(
  product: Omit<Product, "id" | "category_name">,
): Promise<Product> {
  const response = await apiFetch("/products/", {
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

export async function updateProduct(
  productId: number | string,
  product: Omit<Product, "id" | "category_name">,
): Promise<Product> {
  const response = await apiFetch(`/products/${productId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto.");
  }

  return response.json();
}

export async function deleteProduct(
  productId: number | string,
): Promise<void> {
  const response = await apiFetch(`/products/${productId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto.");
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch("/products/categories/");

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías.");
  }

  return response.json();
}

export async function createCategory(
  category: Omit<Category, "id">,
): Promise<Category> {
  const response = await apiFetch("/products/categories/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la categoría.");
  }

  return response.json();
}

export async function updateCategory(
  categoryId: number,
  category: Omit<Category, "id">,
): Promise<Category> {
  const response = await apiFetch(
    `/products/categories/${categoryId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo actualizar la categoría.");
  }

  return response.json();
}

export async function deleteCategory(
  categoryId: number,
): Promise<void> {
  const response = await apiFetch(
    `/products/categories/${categoryId}/`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("No se pudo eliminar la categoría.");
  }
}

import type { Product } from "@ing-marcsene/types";

import {
  API_URL,
  getAccessToken,
} from "./apiConfig";

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/products/`,
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron obtener los productos.",
    );
  }

  return response.json();
}

export async function createProduct(
  product: Omit<Product, "id" | "category_name">,
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/products/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo crear el producto.",
    );
  }

  return response.json();
}

export async function updateProduct(
  productId: number | string,
  product: Omit<Product, "id" | "category_name">,
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/products/${productId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo actualizar el producto.",
    );
  }

  return response.json();
}

export async function deleteProduct(
  productId: number | string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/products/${productId}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo eliminar el producto.",
    );
  }
}

export interface Category {
  id: number;
  name: string;
  active: boolean;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_URL}/products/categories/`,
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron obtener las categorías.",
    );
  }

  return response.json();
}

export async function createCategory(
  category: Omit<Category, "id">,
): Promise<Category> {
  const response = await fetch(
    `${API_URL}/products/categories/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(category),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo crear la categoría.",
    );
  }

  return response.json();
}

export async function updateCategory(
  categoryId: number,
  category: Omit<Category, "id">,
): Promise<Category> {
  const response = await fetch(
    `${API_URL}/products/categories/${categoryId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(category),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo actualizar la categoría.",
    );
  }

  return response.json();
}

export async function deleteCategory(
  categoryId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/products/categories/${categoryId}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo eliminar la categoría.",
    );
  }
}
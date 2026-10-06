const API_URL = "http://127.0.0.1:8000/api";

export interface SaleItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customer: number;
  status: string;
  total: number;
  created_at: string;
  items: SaleItem[];
}

export interface CreateSaleItem {
  product: number;
  quantity: number;
}

export interface CreateSale {
  customer: number;
  items: CreateSaleItem[];
}

export async function getSales(): Promise<Sale[]> {
  const response = await fetch(`${API_URL}/sales/`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las ventas.");
  }

  return response.json();
}

export async function createSale(
  sale: CreateSale,
): Promise<Sale> {
  const response = await fetch(`${API_URL}/sales/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

export async function getSale(
  saleId: number,
): Promise<Sale> {
  const response = await fetch(
    `${API_URL}/sales/${saleId}/`,
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar la venta.");
  }

  return response.json();
}
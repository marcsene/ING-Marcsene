import { API_URL, getAccessToken } from "./apiConfig";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  created_at: string;
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(
    `${API_URL}/customers/`,
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudieron obtener los clientes.",
    );
  }

  return response.json();
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "created_at">,
): Promise<Customer> {
  const response = await fetch(
    `${API_URL}/customers/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(customer),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo crear el cliente.",
    );
  }

  return response.json();
}

export async function updateCustomer(
  customerId: number,
  customer: Omit<Customer, "id" | "created_at">,
): Promise<Customer> {
  const response = await fetch(
    `${API_URL}/customers/${customerId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(customer),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo actualizar el cliente.",
    );
  }

  return response.json();
}

export async function deleteCustomer(
  customerId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/customers/${customerId}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo eliminar el cliente.",
    );
  }
}
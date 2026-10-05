import { useEffect, useState } from "react";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
  type Customer,
} from "../services/api/customersApi";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [active, setActive] = useState("true");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();

        setCustomers(data);
      } catch {
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  async function handleSaveCustomer(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const customerData = {
      name,
      email,
      phone,
      address,
      active: active === "true",
    };

    try {
      if (editingCustomer) {
        const updatedCustomer = await updateCustomer(
          editingCustomer.id,
          customerData,
        );

        setCustomers((currentCustomers) =>
          currentCustomers.map((customer) =>
            customer.id === updatedCustomer.id
              ? updatedCustomer
              : customer,
          ),
        );
      } else {
        const createdCustomer =
          await createCustomer(customerData);

        setCustomers((currentCustomers) => [
          ...currentCustomers,
          createdCustomer,
        ]);
      }

      resetForm();
    } catch {
      if (editingCustomer) {
        setError("No se pudo actualizar el cliente.");
      } else {
        setError("No se pudo crear el cliente.");
      }
    }
  }

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setActive(customer.active ? "true" : "false");
    setShowForm(true);
    setError("");
  }

  async function handleDeleteCustomer(customerId: number) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(customerId);

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (customer) => customer.id !== customerId,
        ),
      );

      setError("");
    } catch {
      setError("No se pudo eliminar el cliente.");
    }
  }

  function handleNewCustomer() {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setActive("true");
    setError("");
    setShowForm(true);
  }

  function resetForm() {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setActive("true");
    setShowForm(false);
    setError("");
  }

  if (loading) {
    return (
      <section className="customers-page">
        <p>Cargando clientes...</p>
      </section>
    );
  }

  if (error && customers.length === 0) {
    return (
      <section className="customers-page">
        <p>{error}</p>
      </section>
    );
  }

  if (showForm) {
    return (
      <section className="customers-page">
        <div className="page-heading">
          <div>
            <h1>
              {editingCustomer
                ? "Editar cliente"
                : "Nuevo cliente"}
            </h1>

            <p>
              {editingCustomer
                ? "Actualiza la información del cliente."
                : "Ingresa la información del nuevo cliente."}
            </p>
          </div>
        </div>

        <section className="product-form">
          <form onSubmit={handleSaveCustomer}>
            <div className="form-group">
              <label htmlFor="customer-name">
                Nombre
              </label>

              <input
                id="customer-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-email">
                Correo electrónico
              </label>

              <input
                id="customer-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-phone">
                Teléfono
              </label>

              <input
                id="customer-phone"
                type="text"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-address">
                Dirección
              </label>

              <input
                id="customer-address"
                type="text"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-active">
                Estado
              </label>

              <select
                id="customer-active"
                value={active}
                onChange={(event) =>
                  setActive(event.target.value)
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            {error && <p>{error}</p>}

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
              >
                Cancelar
              </button>

              <button type="submit">
                {editingCustomer
                  ? "Actualizar cliente"
                  : "Guardar cliente"}
              </button>
            </div>
          </form>
        </section>
      </section>
    );
  }

  return (
    <section className="customers-page">
      <div className="page-heading">
        <div>
          <h1>Clientes</h1>

          <p>
            Administra los clientes de tu negocio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewCustomer}
        >
          Nuevo cliente
        </button>
      </div>

      {error && <p>{error}</p>}

      <div className="customers-list">
        {customers.map((customer) => (
          <article
            className="customer-card"
            key={customer.id}
          >
            <div>
              <h2>{customer.name}</h2>

              <p>{customer.email || "Sin correo"}</p>

              <p>{customer.phone || "Sin teléfono"}</p>

              <p>{customer.address || "Sin dirección"}</p>

              <span>
                {customer.active
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>

            <div>
              <button
                type="button"
                onClick={() =>
                  handleEditCustomer(customer)
                }
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDeleteCustomer(customer.id)
                }
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
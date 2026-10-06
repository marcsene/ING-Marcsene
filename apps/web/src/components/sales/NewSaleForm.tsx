import { useEffect, useState } from "react";

import { getCustomers } from "../../services/api/customersApi";
import { getProducts } from "../../services/api/productsApi";
import {
  createSale,
  type CreateSale,
} from "../../services/api/salesApi";

interface CustomerOption {
  id: number;
  name: string;
}

interface ProductOption {
  id: number | string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
}

interface NewSaleFormProps {
  onCancel: () => void;
  onCreated: () => void;
}

export function NewSaleForm({
  onCancel,
  onCreated,
}: NewSaleFormProps) {
  const [customers, setCustomers] = useState<
    CustomerOption[]
  >([]);

  const [products, setProducts] = useState<
    ProductOption[]
  >([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [customersData, productsData] =
          await Promise.all([
            getCustomers(),
            getProducts(),
          ]);

        setCustomers(customersData);

        setProducts(
          productsData.filter(
            (product) => product.active,
          ),
        );
      } catch {
        setError(
          "No se pudieron cargar clientes y productos.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const selectedProduct = products.find(
    (product) =>
      String(product.id) === productId,
  );

  const subtotal = selectedProduct
    ? selectedProduct.price * quantity
    : 0;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!customerId || !productId) {
      return;
    }

    if (
      selectedProduct &&
      quantity > selectedProduct.stock
    ) {
      setError(
        `Stock insuficiente. Disponible: ${selectedProduct.stock}.`,
      );

      return;
    }

    setSaving(true);
    setError("");

    const sale: CreateSale = {
      customer: Number(customerId),
      items: [
        {
          product: Number(productId),
          quantity,
        },
      ],
    };

    try {
      await createSale(sale);

      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar la venta.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="new-sale-form">
        <h2>Nueva venta</h2>

        <p>
          Cargando clientes y productos...
        </p>
      </div>
    );
  }

  return (
    <form
      className="new-sale-form"
      onSubmit={handleSubmit}
    >
      <div className="new-sale-heading">
        <div>
          <h2>Nueva venta</h2>

          <p>
            Registra una nueva venta para tu negocio.
          </p>
        </div>
      </div>

      {error && (
        <div className="new-sale-error">
          {error}
        </div>
      )}

      <div className="new-sale-fields">
        <label>
          Cliente

          <select
            value={customerId}
            onChange={(event) =>
              setCustomerId(event.target.value)
            }
          >
            <option value="">
              Seleccionar cliente
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Producto

          <select
            value={productId}
            onChange={(event) =>
              setProductId(event.target.value)
            }
          >
            <option value="">
              Seleccionar producto
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name} — $
                {Number(
                  product.price,
                ).toLocaleString("es-CL")}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cantidad

          <input
            type="number"
            min="1"
            max={
              selectedProduct?.stock ?? undefined
            }
            value={quantity}
            onChange={(event) =>
              setQuantity(
                Math.max(
                  1,
                  Number(event.target.value),
                ),
              )
            }
          />
        </label>
      </div>

      {selectedProduct && (
        <div className="new-sale-summary">
          <div>
            <span>Stock disponible</span>

            <strong>
              {selectedProduct.stock} unidades
            </strong>
          </div>

          <div>
            <span>Precio unitario</span>

            <strong>
              $
              {Number(
                selectedProduct.price,
              ).toLocaleString("es-CL")}
            </strong>
          </div>

          <div>
            <span>Subtotal</span>

            <strong>
              ${subtotal.toLocaleString("es-CL")}
            </strong>
          </div>
        </div>
      )}

      <div className="new-sale-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            !customerId ||
            !productId
          }
        >
          {saving
            ? "Registrando..."
            : "Registrar venta"}
        </button>
      </div>
    </form>
  );
}
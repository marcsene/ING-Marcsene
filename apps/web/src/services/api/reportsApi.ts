
import { getCustomers } from "./customersApi";
import { getProducts } from "./productsApi";
import { getSales } from "./salesApi";

export async function getBusinessSummary() {
  const [products, customers, sales] = await Promise.all([
    getProducts(),
    getCustomers(),
    getSales(),
  ]);

  const completedSales = sales.filter(
    (sale) => sale.status === "completed",
  );

  const totalSales = completedSales.reduce(
    (total, sale) => total + Number(sale.total),
    0,
  );

  const stockUnits = products.reduce(
    (total, product) => total + Number(product.stock),
    0,
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.stock),
    0,
  );

  return {
    sales: totalSales,
    saleCount: completedSales.length,
    averageSale: completedSales.length
      ? totalSales / completedSales.length
      : 0,
    products: products.length,
    activeProducts: products.filter((product) => product.active).length,
    stockUnits,
    lowStock: products.filter((product) => product.stock <= 5).length,
    customers: customers.length,
    inventoryValue,
  };
}
    
import { SalesReport } from "../components/Reportes/SalesReport";
import { BusinessSummary } from "../components/Reportes/BusinessSummary";
import { ReportCard } from "../components/Reportes/ReportCard";
import { InventoryReport } from "../components/Reportes/InventoryReport";
import { ProductReport } from "../components/Reportes/ProductReport";
import { CustomerReport } from "../components/Reportes/CustomerReport";

export function ReportsPage() {
  return (
    <section className="reports-page">
      <div className="page-heading">
        <div>
          <h1>Reportes</h1>

          <p>
            Analiza la información de tu negocio.
          </p>
        </div>
      </div>

      <div className="reports-grid">
        <ReportCard
          icon="📈"
          title="Ventas"
          description="Consulta el comportamiento de las ventas de tu negocio."
        />

        <ReportCard
          icon="📦"
          title="Inventario"
          description="Analiza el estado y disponibilidad de tus productos."
        />

        <ReportCard
          icon="🛍️"
          title="Productos"
          description="Consulta información y comportamiento de tus productos."
        />

        <ReportCard
          icon="👥"
          title="Clientes"
          description="Consulta información y actividad de tus clientes."
        />
      </div>

      <BusinessSummary />
      <SalesReport />
      <InventoryReport />
      <ProductReport />
      <CustomerReport />
    </section>
  );
}
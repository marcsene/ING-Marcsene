export function SalesPage() {
  return (
    <section className="sales-page">
      <div className="page-heading">
        <div>
          <h1>Ventas</h1>

          <p>
            Gestiona las ventas realizadas por tu negocio.
          </p>
        </div>

        <button type="button">
          Nueva venta
        </button>
      </div>

      <div className="module-empty-state">
        <h2>Gestión de ventas</h2>

        <p>
          Aquí podrás registrar ventas, consultar
          operaciones y revisar el historial.
        </p>
      </div>
    </section>
  );
}
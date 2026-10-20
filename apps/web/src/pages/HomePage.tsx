
import "./HomePage.css";

interface HomePageProps {
  onLogin: () => void;
}

export function HomePage({ onLogin }: HomePageProps) {
  return (
    <main className="home-page">
      <header className="home-header">
        <a href="#inicio" className="home-brand">
          <span className="home-logo">IM</span>
          <span>
            <strong>ING.Marcsene</strong>
            <small>BUSINESS</small>
          </span>
        </a>

        <nav>
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#planes">Planes</a>
        </nav>

        <button onClick={onLogin} className="home-login">
          Iniciar sesión
        </button>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-copy">
          <span className="home-eyebrow">
            GESTIÓN INTELIGENTE PARA TU NEGOCIO
          </span>

          <h1>
            Tu negocio merece
            <span> crecer más.</span>
          </h1>

          <p>
            Gestiona productos, inventario, clientes y ventas desde
            una plataforma diseñada para ayudarte a trabajar con
            más organización y tomar mejores decisiones.
          </p>

          <button onClick={onLogin} className="home-primary">
            Acceder a mi negocio →
          </button>

          <div className="home-benefits">
            <span>✓ Productos e inventario</span>
            <span>✓ Registro de ventas</span>
            <span>✓ Reportes del negocio</span>
          </div>
        </div>

        <div className="home-dashboard">
          <div className="home-dashboard-heading">
            <div>
              <small>PANEL DE CONTROL</small>
              <h2>Resumen del negocio</h2>
            </div>
            <span className="home-status">Demostración</span>
          </div>

          <div className="home-metrics">
            <article>
              <span>Productos</span>
              <strong>Inventario</strong>
              <small>Organiza tus existencias</small>
            </article>

            <article>
              <span>Ventas</span>
              <strong>Operaciones</strong>
              <small>Consulta tus movimientos</small>
            </article>
          </div>

          <div className="home-chart">
            <strong>Actividad del negocio</strong>
            <div className="home-bars" aria-hidden="true">
              {[35, 55, 42, 75, 48, 85, 63, 96, 69, 78, 58, 90].map(
                (height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ),
              )}
            </div>
            <small>Vista ilustrativa, no son datos reales.</small>
          </div>
        </div>
      </section>

      <section className="home-features" id="funcionalidades">
        <div className="home-section-heading">
          <span>UNA PLATAFORMA, MÚLTIPLES HERRAMIENTAS</span>
          <h2>Todo organizado en un solo lugar</h2>
          <p>Las funciones esenciales para administrar tu negocio.</p>
        </div>

        <div className="home-feature-grid">
          <article>
            <span>▦</span>
            <h3>Productos</h3>
            <p>Organiza categorías, precios y catálogo.</p>
          </article>

          <article>
            <span>↗</span>
            <h3>Ventas</h3>
            <p>Registra operaciones y consulta sus detalles.</p>
          </article>

          <article>
            <span>▤</span>
            <h3>Inventario</h3>
            <p>Controla las existencias de tus productos.</p>
          </article>

          <article>
            <span>♙</span>
            <h3>Clientes</h3>
            <p>Mantén organizada la información de tus clientes.</p>
          </article>

          <article>
            <span>▥</span>
            <h3>Reportes</h3>
            <p>Consulta información para tomar decisiones.</p>
          </article>

          <article>
            <span>◎</span>
            <h3>Gestión centralizada</h3>
            <p>Accede a tus herramientas desde la web.</p>
          </article>
        </div>
      </section>

      <section className="home-plans" id="planes">
        <span>ING.Marcsene Business</span>
        <h2>Prepara tu negocio para crecer</h2>
        <p>
          Conoce nuestra plataforma. Los precios y las suscripciones
          se publicarán cuando estén habilitados.
        </p>
        <button onClick={onLogin} className="home-primary">
          Iniciar sesión →
        </button>
      </section>

      <footer className="home-footer">
        <strong>ING.Marcsene Business</strong>
        <span>Gestión empresarial para crecer con organización.</span>
        <span>© {new Date().getFullYear()} ING.Marcsene</span>
      </footer>
    </main>
  );
}

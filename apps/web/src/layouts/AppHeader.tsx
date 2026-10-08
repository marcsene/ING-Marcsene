import logo from "../assets/brand/ing-marcsene-logo.png";


export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-brand">
        <img
          src={logo}
          alt="ING.Marcsene"
          className="app-brand-logo"
        />
      </div>

      <div className="app-user">
        <span>Administrador</span>
      </div>
    </header>
  );
}
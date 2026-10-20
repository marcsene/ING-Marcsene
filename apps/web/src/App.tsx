
import { useEffect, useState } from "react";

import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("access_token"),
  );
  const [showLogin, setShowLogin] = useState(
    () => window.location.hash === "#login",
  );

  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null);
      setShowLogin(true);
    }

    function handleHashChange() {
      setShowLogin(window.location.hash === "#login");
    }

    window.addEventListener("auth:expired", handleSessionExpired);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("auth:expired", handleSessionExpired);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function handleLogin(token: string) {
    setAccessToken(token);
    window.location.hash = "";
  }

  function openLogin() {
    setShowLogin(true);
    window.location.hash = "login";
  }

  function openHome() {
    setShowLogin(false);
    window.location.hash = "";
  }

  if (!accessToken) {
    if (showLogin) {
      return (
        <div>
          <button
            type="button"
            onClick={openHome}
            style={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 10,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ← Volver al inicio
          </button>
          <LoginPage onLogin={handleLogin} />
        </div>
      );
    }

    return <HomePage onLogin={openLogin} />;
  }

  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}

export default App;

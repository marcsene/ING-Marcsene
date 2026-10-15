
import { useEffect, useState } from "react";

import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("access_token"),
  );

  useEffect(() => {
    function handleSessionExpired() {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setAccessToken(null);
    }

    window.addEventListener("auth:expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:expired", handleSessionExpired);
    };
  }, []);

  function handleLogin(token: string) {
    setAccessToken(token);
  }

  if (!accessToken) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}

export default App;

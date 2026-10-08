import { useState } from "react";

import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token"),
  );

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
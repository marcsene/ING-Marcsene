import "./App.css";
import { MainLayout } from "./layouts/MainLayout";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  return (
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  );
}

export default App;
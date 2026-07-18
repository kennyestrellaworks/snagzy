import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout/Layout";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Users from "./pages/Users";
import Stores from "./pages/Stores";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/analytics" replace />} />
            <Route path="/analytics" element={<Inventory />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reviews" element={<Reviews />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

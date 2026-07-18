import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Stores from "./pages/Stores";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";
import { ColorPalette } from "./pages/ColorPalette";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<Navigate to="/inventory" replace />} />

            <Route path="/colorpalette" element={<ColorPalette />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

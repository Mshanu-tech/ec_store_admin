import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Users from "./pages/Users.jsx";
import Coupons from "./pages/Coupons.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

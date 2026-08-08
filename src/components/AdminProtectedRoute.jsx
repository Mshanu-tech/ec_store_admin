import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

export default function AdminProtectedRoute({ children }) {
  const { admin } = useAdminAuth();
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

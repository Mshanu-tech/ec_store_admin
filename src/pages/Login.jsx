import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-center mb-1">
          <span className="text-primary">Fresh</span><span className="text-secondary">Catch</span>
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">Admin Panel Login</p>
        <div className="space-y-3">
          <input required type="email" placeholder="Admin Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input" />
          <button className="btn-primary w-full justify-center">Login</button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">Seed credentials: admin@freshcatch.com / admin123</p>
      </form>
    </div>
  );
}

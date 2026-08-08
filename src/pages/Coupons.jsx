import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import api from "../api/axios.js";

const emptyForm = { code: "", type: "percentage", value: "", minOrderAmount: "0", maxDiscount: "", expiresAt: "", isActive: true, usageLimit: "0" };

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get("/coupons").then(({ data }) => setCoupons(data.coupons));

  useEffect(() => {
    async function fetchCoupons() {
      try {
        await load();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load coupons");
      }
    }

    fetchCoupons();
  }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ ...c, value: String(c.value), minOrderAmount: String(c.minOrderAmount), maxDiscount: String(c.maxDiscount || ""), usageLimit: String(c.usageLimit), expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "" });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      value: Number(form.value),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      usageLimit: Number(form.usageLimit) || 0,
      expiresAt: form.expiresAt || undefined,
    };
    try {
      if (editing) await api.put(`/coupons/${editing._id}`, payload);
      else await api.post("/coupons", payload);
      toast.success(editing ? "Coupon updated" : "Coupon created");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`);
    toast.success("Coupon deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={openCreate} className="btn-primary"><FaPlus size={12} /> Add Coupon</button>
      </div>
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {coupons.map((c) => (
          <div key={c._id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono font-semibold">{c.code}</p>
              <span className={`badge shrink-0 ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {c.isActive ? "Active" : "Off"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-1 text-sm mt-2">
              <span className="text-gray-400">Type</span>
              <span className="capitalize text-right">{c.type}</span>
              <span className="text-gray-400">Value</span>
              <span className="text-right">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</span>
              <span className="text-gray-400">Min order</span>
              <span className="text-right">₹{c.minOrderAmount}</span>
              <span className="text-gray-400">Used</span>
              <span className="text-right">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</span>
            </div>
            <div className="flex gap-4 mt-3">
              <button onClick={() => openEdit(c)} className="text-primary text-sm font-semibold flex items-center gap-1"><FaEdit /> Edit</button>
              <button onClick={() => remove(c._id)} className="text-red-400 text-sm font-semibold flex items-center gap-1"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
        {coupons.length === 0 && <div className="card p-8 text-center text-gray-400 text-sm">No coupons found</div>}
      </div>

      {/* Desktop: table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Code</th><th className="p-4">Type</th><th className="p-4">Value</th><th className="p-4">Min Order</th><th className="p-4">Used</th><th className="p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="p-4 font-mono font-semibold">{c.code}</td>
                <td className="p-4 capitalize">{c.type}</td>
                <td className="p-4">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-4">₹{c.minOrderAmount}</td>
                <td className="p-4">{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                <td className="p-4"><span className={`badge ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isActive ? "Active" : "Off"}</span></td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(c)} className="text-primary"><FaEdit /></button>
                    <button onClick={() => remove(c._id)} className="text-red-400"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No coupons found</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editing ? "Edit Coupon" : "Add Coupon"}</h2>
              <button type="button" onClick={() => setModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="space-y-3">
              <input required placeholder="Code e.g. WELCOME10" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="input" />
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="input">
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
              <input required type="number" placeholder="Value" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="input" />
              <input type="number" placeholder="Min Order Amount" value={form.minOrderAmount} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))} className="input" />
              <input type="number" placeholder="Max Discount (optional)" value={form.maxDiscount} onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))} className="input" />
              <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))} className="input" />
              <input type="number" placeholder="Usage Limit (0 = unlimited)" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className="input" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active</label>
              <button className="btn-primary w-full justify-center">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

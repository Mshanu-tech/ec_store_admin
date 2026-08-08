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
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Used</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="p-4 font-mono font-semibold">{c.code}</td>
                <td className="capitalize">{c.type}</td>
                <td>{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td>₹{c.minOrderAmount}</td>
                <td>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                <td><span className={`badge ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{c.isActive ? "Active" : "Off"}</span></td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openEdit(c)} className="text-primary"><FaEdit /></button>
                  <button onClick={() => remove(c._id)} className="text-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
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

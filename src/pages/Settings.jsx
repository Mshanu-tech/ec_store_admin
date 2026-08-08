import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function Settings() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setForm(data.settings));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", form);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  if (!form) return <div className="card h-64 animate-pulse" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
      <form onSubmit={submit} className="card p-6 max-w-xl space-y-3">
        <input placeholder="Store Name" value={form.storeName} onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))} className="input" />
        <input placeholder="Store Email" value={form.storeEmail} onChange={(e) => setForm((f) => ({ ...f, storeEmail: e.target.value }))} className="input" />
        <input placeholder="Store Phone" value={form.storePhone} onChange={(e) => setForm((f) => ({ ...f, storePhone: e.target.value }))} className="input" />
        <input placeholder="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))} className="input" />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="input" />
        <input placeholder="Store Timings" value={form.storeTimings} onChange={(e) => setForm((f) => ({ ...f, storeTimings: e.target.value }))} className="input" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Delivery Charge (₹)</label>
            <input type="number" value={form.deliveryCharge} onChange={(e) => setForm((f) => ({ ...f, deliveryCharge: Number(e.target.value) }))} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Free Delivery Above (₹)</label>
            <input type="number" value={form.freeDeliveryThreshold} onChange={(e) => setForm((f) => ({ ...f, freeDeliveryThreshold: Number(e.target.value) }))} className="input" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.codEnabled} onChange={(e) => setForm((f) => ({ ...f, codEnabled: e.target.checked }))} /> Cash on Delivery Enabled</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.onlinePaymentEnabled} onChange={(e) => setForm((f) => ({ ...f, onlinePaymentEnabled: e.target.checked }))} /> Online Payment Enabled</label>
        <button className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}

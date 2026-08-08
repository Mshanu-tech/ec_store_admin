import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-sky-100 text-sky-700",
  processing: "bg-sky-100 text-sky-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/orders/admin/all", { params: filter ? { status: filter } : {} }).then(({ data }) => setOrders(data.orders));
  }, [filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-48">
          <option value="">All Statuses</option>
          {Object.keys(statusColor).map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Invoice</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b last:border-0">
                <td className="p-4">{o.invoiceNumber}</td>
                <td>{o.user?.name}<br /><span className="text-xs text-gray-400">{o.user?.phone}</span></td>
                <td>{o.items.length}</td>
                <td>₹{o.totalPrice}</td>
                <td><span className={`badge ${statusColor[o.status]}`}>{o.status.replace("_", " ")}</span></td>
                <td className="p-4"><Link to={`/orders/${o._id}`} className="text-primary font-semibold">View</Link></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No orders found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {orders.map((o) => (
          <Link to={`/orders/${o._id}`} key={o._id} className="card p-4 block">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold truncate">{o.invoiceNumber}</p>
                <p className="text-sm text-gray-500 truncate">{o.user?.name}</p>
                <p className="text-xs text-gray-400">{o.user?.phone}</p>
              </div>
              <span className={`badge shrink-0 ${statusColor[o.status]}`}>{o.status.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-500">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
              <span className="font-semibold">₹{o.totalPrice}</span>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <div className="card p-8 text-center text-gray-400 text-sm">No orders found</div>}
      </div>

      {/* Desktop: table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Invoice</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b last:border-0">
                <td className="p-4">{o.invoiceNumber}</td>
                <td className="p-4">{o.user?.name}<br /><span className="text-xs text-gray-400">{o.user?.phone}</span></td>
                <td className="p-4">{o.items.length}</td>
                <td className="p-4">₹{o.totalPrice}</td>
                <td className="p-4"><span className={`badge ${statusColor[o.status]}`}>{o.status.replace("_", " ")}</span></td>
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

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaShoppingBag, FaBoxOpen, FaRupeeSign } from "react-icons/fa";
import api from "../api/axios.js";

const COLORS = ["#4FC3F7", "#66BB6A", "#FFB74D", "#7986CB", "#EF5350", "#26C6DA", "#AB47BC"];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="card h-64 animate-pulse" />;

  const { stats, statusBreakdown, topProducts, recentOrders } = data;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers />, color: "bg-sky-50 text-primary" },
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag />, color: "bg-green-50 text-secondary" },
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen />, color: "bg-amber-50 text-amber-500" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <FaRupeeSign />, color: "bg-indigo-50 text-indigo-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.color}`}>{c.icon}</div>
            <div><p className="text-2xl font-bold">{c.value}</p><p className="text-xs text-gray-500">{c.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Top Products (by quantity sold)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts}>
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="qty" fill="#4FC3F7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h2 className="font-bold mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="count" nameKey="_id" outerRadius={90} label>
                {statusBreakdown.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="pb-2">Invoice</th><th className="pb-2">Customer</th><th className="pb-2">Amount</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-b last:border-0">
                  <td className="py-2">{o.invoiceNumber}</td>
                  <td className="py-2">{o.user?.name}</td>
                  <td className="py-2">₹{o.totalPrice}</td>
                  <td className="py-2 capitalize">{o.status.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLock, FaLockOpen } from "react-icons/fa";
import api from "../api/axios.js";

export default function Users() {
  const [users, setUsers] = useState([]);

  const load = () => api.get("/users").then(({ data }) => setUsers(data.users));

  useEffect(() => {
    async function fetchUsers() {
      try {
        await load();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load users");
      }
    }

    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    await api.put(`/users/${id}/toggle-block`);
    toast.success("User status updated");
    load();
  };

  return (
    <div>
      {/* Mobile: stacked cards */}
      <div className="grid gap-3 md:hidden">
        {users.map((u) => (
          <div key={u._id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                {u.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold truncate">{u.name}</p>
                  <span className={`badge shrink-0 ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{u.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-1.5 text-sm mt-3 pt-3 border-t border-gray-100">
              <span className="text-gray-400">Phone</span>
              <span className="text-right">{u.phone || "—"}</span>
              <span className="text-gray-400">Joined</span>
              <span className="text-right">{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => toggleBlock(u._id)}
              className={`w-full justify-center mt-3 text-sm font-semibold flex items-center gap-2 rounded-xl py-2 ${
                u.isBlocked ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
              }`}
            >
              {u.isBlocked ? <FaLockOpen /> : <FaLock />}
              {u.isBlocked ? "Unblock user" : "Block user"}
            </button>
          </div>
        ))}
        {users.length === 0 && <div className="card p-8 text-center text-gray-400 text-sm">No users found</div>}
      </div>

      {/* Desktop: table */}
      <div className="card overflow-x-auto hidden md:block">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Joined</th><th className="p-4">Status</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.phone || "—"}</td>
                <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`badge ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => toggleBlock(u._id)} className="text-primary font-semibold">
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
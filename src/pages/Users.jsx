import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="p-4">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "—"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import api from "../api/axios.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", isActive: true });

  const load = () => api.get("/categories/admin/all").then(({ data }) => setCategories(data.categories));

  useEffect(() => {
    async function fetchCategories() {
      try {
        await load();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load categories");
      }
    }

    fetchCategories();
  }, []);

  const openCreate = () => { setEditing(null); setForm({ name: "", description: "", image: "", isActive: true }); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setModalOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/categories/${editing._id}`, form);
      else await api.post("/categories", form);
      toast.success(editing ? "Category updated" : "Category created");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={openCreate} className="btn-primary"><FaPlus size={12} /> Add Category</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="card p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.description}</p>
              </div>
              <span className={`badge ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {c.isActive ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => openEdit(c)} className="text-primary text-sm flex items-center gap-1"><FaEdit /> Edit</button>
              <button onClick={() => remove(c._id)} className="text-red-400 text-sm flex items-center gap-1"><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editing ? "Edit Category" : "Add Category"}</h2>
              <button type="button" onClick={() => setModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="space-y-3">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" rows={2} />
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="input" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active</label>
              <button className="btn-primary w-full justify-center">{editing ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

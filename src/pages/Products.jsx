import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import api from "../api/axios.js";

const emptyForm = {
  name: "", description: "", category: "", isFeatured: false, isActive: true,
  images: [""], tags: "", priceOptions: [{ weight: "250g", price: "", mrp: "", stock: "50" }],
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadAll = () => {
    api.get("/products/admin/all").then(({ data }) => setProducts(data.products));
    api.get("/categories/admin/all").then(({ data }) => setCategories(data.categories));
  };
  useEffect(loadAll, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImagePreview(""); setModalOpen(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, category: p.category?._id || p.category,
      isFeatured: p.isFeatured, isActive: p.isActive,
      images: p.images.length ? p.images : [""],
      tags: p.tags.join(", "),
      priceOptions: p.priceOptions.map((o) => ({ ...o, price: String(o.price), mrp: String(o.mrp || ""), stock: String(o.stock) })),
    });
    setImagePreview(p.images?.[0] || "");
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (uploadingImage) {
      toast.error("Please wait for the image upload to finish");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    const hasEmptyWeight = form.priceOptions.some((o) => !String(o.weight || "").trim());
    if (hasEmptyWeight) {
      toast.error("Each price option must include a weight");
      return;
    }

    const payload = {
      ...form,
      category: form.category,
      images: form.images.filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      priceOptions: form.priceOptions.map((o) => ({
        weight: String(o.weight).trim(),
        price: Number(o.price),
        mrp: Number(o.mrp) || undefined,
        stock: Number(o.stock) || 0,
      })),
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    loadAll();
  };

  const updateOption = (i, key, value) => {
    setForm((f) => {
      const opts = [...f.priceOptions];
      opts[i] = { ...opts[i], [key]: value };
      return { ...f, priceOptions: opts };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setUploadingImage(true);

    const formData = new FormData();
    formData.append("images", file);

    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = data.urls?.[0];
      if (!uploadedUrl) throw new Error("No image URL returned");
      setForm((f) => ({ ...f, images: [uploadedUrl] }));
      setImagePreview(uploadedUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed");
      setForm((f) => ({ ...f, images: [""] }));
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="btn-primary"><FaPlus size={12} /> Add Product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="p-4">Name</th><th>Category</th><th>Price</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100" />
                    )}
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td>{p.category?.name}</td>
                <td>₹{p.priceOptions[0]?.price} ({p.priceOptions[0]?.weight})</td>
                <td>
                  <span className={`badge ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => openEdit(p)} className="text-primary"><FaEdit /></button>
                  <button onClick={() => remove(p._id)} className="text-red-400"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editing ? "Edit Product" : "Add Product"}</h2>
              <button type="button" onClick={() => setModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
              <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" rows={3} />
              <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Upload image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary" />
              </label>
              {uploadingImage ? <p className="text-sm text-gray-500">Uploading image...</p> : null}
              {(imagePreview || form.images[0]) && (
                <div className="mt-2">
                  <img src={imagePreview || form.images[0]} alt="Preview" className="h-32 w-32 rounded object-cover border" />
                </div>
              )}
              <input placeholder="Tags (comma separated, e.g. Fresh, Bestseller)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} className="input" />

              <div>
                <p className="text-sm font-semibold mb-2">Price Options (by weight)</p>
                {form.priceOptions.map((o, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input placeholder="Weight" value={o.weight} onChange={(e) => updateOption(i, "weight", e.target.value)} className="input" />
                    <input placeholder="Price" type="number" value={o.price} onChange={(e) => updateOption(i, "price", e.target.value)} className="input" />
                    <input placeholder="MRP" type="number" value={o.mrp} onChange={(e) => updateOption(i, "mrp", e.target.value)} className="input" />
                    <input placeholder="Stock" type="number" value={o.stock} onChange={(e) => updateOption(i, "stock", e.target.value)} className="input" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priceOptions: [...f.priceOptions, { weight: "250g", price: "", mrp: "", stock: "50" }] }))}
                  className="text-primary text-sm font-semibold"
                >
                  + Add weight option
                </button>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active</label>
              </div>

              <button disabled={uploadingImage} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {uploadingImage ? "Uploading image..." : editing ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

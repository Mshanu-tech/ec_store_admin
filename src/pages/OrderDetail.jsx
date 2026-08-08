import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const statuses = ["pending", "accepted", "processing", "out_for_delivery", "delivered", "cancelled", "rejected"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
      setStatus(data.order.status);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load order");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (isMounted) {
          setOrder(data.order);
          setStatus(data.order.status);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || "Failed to load order");
        }
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const updateStatus = async () => {
    try {
      await api.put(`/orders/${id}/status`, { status, note });
      toast.success("Order status updated");
      setNote("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (!order) return <div className="card h-64 animate-pulse" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Order #{order.invoiceNumber}</h1>
      <p className="text-gray-500 text-sm mb-6">Placed {new Date(order.createdAt).toLocaleString()}</p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card p-6">
          <h2 className="font-bold mb-3">Items</h2>
          {order.items.map((i, idx) => (
            <div key={idx} className="flex justify-between text-sm py-1">
              <span>{i.name} ({i.weight}) × {i.quantity}</span>
              <span>₹{i.price * i.quantity}</span>
            </div>
          ))}
          <hr className="my-3" />
          <div className="flex justify-between font-bold"><span>Total</span><span>₹{order.totalPrice}</span></div>

          <h2 className="font-bold mt-6 mb-2">Status History</h2>
          <ul className="text-sm space-y-1">
            {order.statusHistory?.map((h, i) => (
              <li key={i} className="text-gray-500">
                <span className="capitalize font-medium text-ink">{h.status.replace("_", " ")}</span> — {new Date(h.at).toLocaleString()} {h.note && `(${h.note})`}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold mb-3">Customer</h2>
            <p className="text-sm">{order.user?.name}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
            <p className="text-sm text-gray-500">{order.user?.phone}</p>
            <h3 className="font-semibold mt-4 mb-1 text-sm">Shipping Address</h3>
            <p className="text-sm text-gray-500">
              {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-3">Update Status</h2>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input mb-3">
              {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <textarea placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="input mb-3" rows={2} />
            <button onClick={updateStatus} className="btn-primary w-full justify-center">Update Status</button>
          </div>
        </div>
      </div>
    </div>
  );
}

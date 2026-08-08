import { NavLink, Outlet } from "react-router-dom";
import {
  FaTachometerAlt, FaBoxOpen, FaShoppingBag, FaUsers, FaTags, FaTicketAlt, FaCog, FaSignOutAlt,
} from "react-icons/fa";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";

const links = [
  { to: "/", end: true, icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/products", icon: <FaBoxOpen />, label: "Products" },
  { to: "/categories", icon: <FaTags />, label: "Categories" },
  { to: "/orders", icon: <FaShoppingBag />, label: "Orders" },
  { to: "/users", icon: <FaUsers />, label: "Users" },
  { to: "/coupons", icon: <FaTicketAlt />, label: "Coupons" },
  { to: "/settings", icon: <FaCog />, label: "Settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-white border-r border-gray-100 p-5 flex flex-col">
        <div className="font-extrabold text-lg mb-8">
          <span className="text-primary">Fresh</span><span className="text-secondary">Catch</span>
          <div className="text-[10px] tracking-widest text-gray-400 font-semibold">ADMIN PANEL</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? "bg-primary text-white" : "text-ink hover:bg-accent"
                }`
              }
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-semibold">{admin?.name}</p>
          <button onClick={logout} className="text-sm text-red-500 flex items-center gap-2 mt-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
      <main className="p-6 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

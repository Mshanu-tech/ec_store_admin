import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt, FaBoxOpen, FaShoppingBag, FaUsers, FaTags, FaTicketAlt, FaCog, FaSignOutAlt,
  FaBars, FaTimes, FaBell, FaSearch,
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

// Subset of links shown in the mobile bottom bar (keep it to 5 for thumb reach)
const bottomLinks = [
  { to: "/", end: true, icon: <FaTachometerAlt />, label: "Home" },
  { to: "/products", icon: <FaBoxOpen />, label: "Products" },
  { to: "/orders", icon: <FaShoppingBag />, label: "Orders" },
  { to: "/users", icon: <FaUsers />, label: "Users" },
  { to: "/settings", icon: <FaCog />, label: "Settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentLabel =
    links.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)))?.label ||
    "Dashboard";

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: fixed slide-in drawer on mobile, static column on desktop */}
      <aside
        className={`bg-white border-r border-gray-100 p-5 flex flex-col fixed inset-y-0 left-0 w-64 z-40 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-auto md:z-auto`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="font-extrabold text-lg">
            <span className="text-primary">Fresh</span><span className="text-secondary">Catch</span>
            <div className="text-[10px] tracking-widest text-gray-400 font-semibold">ADMIN PANEL</div>
          </div>
          <button
            className="md:hidden text-xl text-gray-400 hover:text-ink p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
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
          <p className="text-sm font-semibold truncate">{admin?.name}</p>
          <button onClick={logout} className="text-sm text-red-500 flex items-center gap-2 mt-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-xl text-gray-500 hover:text-ink p-1 shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            <h1 className="font-bold text-base sm:text-lg truncate">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-500 hover:bg-accent hover:text-primary transition-colors"
              aria-label="Search"
            >
              <FaSearch />
            </button>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-accent hover:text-primary transition-colors relative"
              aria-label="Notifications"
            >
              <FaBell />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {bottomLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 flex-1 text-[11px] font-medium ${
                isActive ? "text-primary" : "text-gray-400"
              }`
            }
          >
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

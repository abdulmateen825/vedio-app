import { motion } from "framer-motion";
import {
  FiHome,
  FiPlayCircle,
  FiUser
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { isSidebarOpen } = useUI();
  const { user } = useAuth();
  const menu = [
    { label: "Home", icon: FiHome, to: "/" },
    { label: "Upload", icon: FiPlayCircle, to: "/upload" },
    ...(user?.username
      ? [{ label: "Profile", icon: FiUser, to: `/profile/${user.username}` }]
      : [])
  ];

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? 240 : 84 }}
      className="hidden min-h-screen border-r border-slate-100 bg-white pt-24 md:block"
    >
      <div className="space-y-2 px-4">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-slate-500 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="text-lg" />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default Sidebar;

import { FiBell, FiMenu, FiSearch, FiUpload } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button.jsx";
import Dropdown from "./Dropdown.jsx";
import { useUI } from "../context/UIContext.jsx";

const Navbar = () => {
  const { isSidebarOpen, setSidebarOpen } = useUI();
  const { pathname } = useLocation();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu className="text-lg" />
          </button>
          <Link to="/home" className="font-display text-xl text-ink">
            Vedio
          </Link>
        </div>

        <div className="hidden w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm md:flex">
          <FiSearch className="text-slate-400" />
          <input
            placeholder="Search creators, topics, or videos"
            className="flex-1 bg-transparent text-sm text-ink outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/upload" className="hidden md:block">
            <Button size="sm">
              <FiUpload />
              Upload
            </Button>
          </Link>
          <button className="rounded-lg p-2 hover:bg-slate-100">
            <FiBell className="text-lg" />
          </button>
          <Dropdown
            trigger={
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80"
                  alt="user"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="hidden text-sm font-medium text-ink md:inline">
                  Alex
                </span>
              </div>
            }
            items={[
              { label: "Profile" },
              { label: "Settings" },
              { label: "Sign out" }
            ]}
          />
        </div>
      </div>
      {pathname === "/home" && (
        <div className="border-t border-slate-100 px-6 pb-4 pt-3 md:hidden">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
            <FiSearch className="text-slate-400" />
            <input
              placeholder="Search videos"
              className="flex-1 bg-transparent text-sm text-ink outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

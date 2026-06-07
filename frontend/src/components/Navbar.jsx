import { FiMenu, FiSearch, FiUpload } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import Dropdown from "./Dropdown.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

const Navbar = () => {
  const { isSidebarOpen, setSidebarOpen } = useUI();
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : "/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || "Vedio")}&background=C2410C&color=fff`;

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
          <Link to="/" className="font-display text-xl text-ink">
            Vedio
          </Link>
        </div>

        <form
          onSubmit={submitSearch}
          className="hidden w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm md:flex"
        >
          <FiSearch className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search creators, topics, or videos"
            className="flex-1 bg-transparent text-sm text-ink outline-none"
          />
        </form>

        <div className="flex items-center gap-3">
          <Link to="/upload" className="hidden md:block">
            <Button size="sm">
              <FiUpload />
              Upload
            </Button>
          </Link>
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2">
                  <img
                    src={avatar}
                    alt={user?.fullname || user?.username || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span className="hidden text-sm font-medium text-ink md:inline">
                    {user?.fullname || user?.username}
                  </span>
                </div>
              }
              items={[
                {
                  label: "Profile",
                  onClick: () => navigate(`/profile/${user?.username}`)
                },
                { label: "Sign out", onClick: handleLogout }
              ]}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/auth/register" className="hidden sm:block">
                <Button size="sm">Create account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {(pathname === "/" || pathname === "/home") && (
        <div className="border-t border-slate-100 px-6 pb-4 pt-3 md:hidden">
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm"
          >
            <FiSearch className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search videos"
              className="flex-1 bg-transparent text-sm text-ink outline-none"
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;

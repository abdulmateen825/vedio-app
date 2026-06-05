import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const value = useMemo(
    () => ({
      isSidebarOpen,
      setSidebarOpen,
      activeCategory,
      setActiveCategory
    }),
    [isSidebarOpen, activeCategory]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within UIProvider");
  }
  return ctx;
};

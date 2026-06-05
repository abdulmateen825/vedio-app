import { motion } from "framer-motion";
import { categories } from "../utils/constants.js";
import { useUI } from "../context/UIContext.jsx";

const CategoryBar = () => {
  const { activeCategory, setActiveCategory } = useUI();

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.03 }}
          onClick={() => setActiveCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === category
              ? "bg-brand text-white shadow-soft"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryBar;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dropdown = ({ trigger, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)}>{trigger}</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-3 w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-soft"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;

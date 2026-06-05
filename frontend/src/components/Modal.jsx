import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button.jsx";

const Modal = ({ open, title, children, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">{title}</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
            <div className="mt-4 text-sm text-slate-600">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

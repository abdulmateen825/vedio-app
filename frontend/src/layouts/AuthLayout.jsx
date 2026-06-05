import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden bg-slate-950 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.3),_transparent_60%)]" />
          <div className="relative z-10 flex flex-col justify-between p-12">
            <div>
              <p className="font-display text-2xl">Vedio</p>
              <p className="mt-4 max-w-sm text-sm text-slate-200">
                Stream, learn, and build your personal media library with a
                premium, distraction-free experience.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Trusted by creators
              </p>
              <p className="mt-3 text-lg">2.6M+ viewers every month</p>
            </div>
          </div>
        </div>
        <motion.div
          className="flex items-center justify-center px-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;

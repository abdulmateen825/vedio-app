import { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes/AppRoutes.jsx";
import Loader from "./components/Loader.jsx";

const App = () => {
  return (
    <Suspense fallback={<Loader />}> 
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </Suspense>
  );
};

export default App;

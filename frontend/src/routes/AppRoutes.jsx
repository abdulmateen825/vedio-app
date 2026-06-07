import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "../layouts/AppLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

const HomeFeed = lazy(() => import("../pages/HomeFeed.jsx"));
const VideoWatch = lazy(() => import("../pages/VideoWatch.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));
const UploadPage = lazy(() => import("../pages/UploadPage.jsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.jsx"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/home" element={<HomeFeed />} />
        <Route path="/watch/:id" element={<VideoWatch />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

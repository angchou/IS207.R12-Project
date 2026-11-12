import { Outlet } from "react-router-dom";
import patternImg from "../assets/background/login-pattern.png";

import AdminNavigationBar from "../components/navigation_bars/AdminNavigationBar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[var(--bg-main)] overflow-hidden">
      <div
        className="absolute inset-0 bg-repeat opacity-15 pointer-events-none z-0"
        style={{ backgroundImage: `url(${patternImg})` }}
      />

      <header className="relative z-10"></header>

      <main className="flex-1 flex-col justify-center items-center relative z-10">
        <AdminNavigationBar />
        <Outlet />
      </main>

      <footer className="relative z-5">
        <Footer />
      </footer>
    </div>
  );
}

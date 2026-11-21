import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import patternImg from "../assets/background/login-pattern.png";

import CustomerNavigationBar from "../components/navigation_bars/CustomerNavigationBar";
import Footer from "../components/Footer";

export default function CustomerLayout() {
  const { pathname } = useLocation();

  // Khi chuyển Home/Menu/Cart, mở trang mới từ đầu thay vì giữ vị trí cuộn cũ.
  // Chỉ đổi query danh mục trong Menu thì giữ nguyên vị trí đang xem.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[var(--bg-main)] overflow-hidden">
      <div
        className="absolute inset-0 bg-repeat opacity-15 pointer-events-none z-0"
        style={{ backgroundImage: `url(${patternImg})` }}
      />

      <header className="relative z-10"></header>

      {/* Chừa 72px cho thanh menu cố định để nội dung các trang không bị che. */}
      <main className="flex-1 flex-col justify-center items-center relative z-10 pt-[72px]">
        <CustomerNavigationBar />
        <Outlet />
      </main>

      <footer className="relative z-5">
        <Footer />
      </footer>
    </div>
  );
}

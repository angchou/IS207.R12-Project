import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const DEFAULT_PROMO_TEXT =
  "FREE DELIVERY ON ORDERS OVER $25.00 • EARN 10 REWARD POINTS PER $1 SPENT";

// Đọc cấu hình Banner đang kích hoạt từ localStorage
function getStoredPromo() {
  try {
    const saved = localStorage.getItem("active_customer_hero_banner");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Thanh thông báo khuyến mãi đầu trang (dùng chung cho CustomerHomePage & Admin Preview)
export default function TopHeader({ promoText, enabled }) {
  const [storedBanner, setStoredBanner] = useState(getStoredPromo);

  // Đồng bộ tự động khi Admin cập nhật Banner ở tab khác
  useEffect(() => {
    const syncStorage = () => setStoredBanner(getStoredPromo());
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  // Ưu tiên prop truyền vào (Admin Preview), sau đó mới lấy từ localStorage
  const isVisible =
    enabled !== undefined
      ? enabled
      : storedBanner?.top_promo_enabled !== undefined
        ? storedBanner.top_promo_enabled
        : true;

  if (!isVisible) return null;

  const displayPromoText =
    promoText || storedBanner?.top_promo_text || DEFAULT_PROMO_TEXT;

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-dark)] text-[var(--text-inverse)] shadow-[var(--shadow-md)]">
      <div className="bg-[var(--btn-primary-hover)] py-1.5 px-4 text-center text-xs font-semibold tracking-wider text-[var(--bg-hero)] flex items-center justify-center gap-2">
        <Sparkles
          size={14}
          className="animate-pulse text-[var(--btn-secondary-default)] shrink-0"
        />
        <span>{displayPromoText}</span>
      </div>
    </header>
  );
}

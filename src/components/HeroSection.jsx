import { useState, useEffect } from "react";
import { Flame, ChevronRight, Clock, ShieldCheck, Star } from "lucide-react";

// Dữ liệu Banner mặc định khi Admin chưa cấu hình banner mới
const DEFAULT_HERO_BANNER = {
  hero_badge: "CRAVING REAL FAST FOOD?",
  headline_main: "Hot, Sizzling",
  headline_highlight: "Juicy Burgers",
  headline_sub: "& Wings",
  description:
    "Fresh Angus beef patties smashed to perfection, crispy buttermilk fried chicken, and stone-baked pizza delivered piping hot to your doorstep.",
  primary_cta_text: "Order Online Now",
  primary_cta_link: "#menu-section",
  secondary_cta_text: "View Deals & Combos",
  secondary_cta_link: "#hot-combos",
  delivery_subtext: "25 Min Fast Delivery",
  quality_subtext: "100% Fresh Ingredients",
  featured_badge: "Featured Today",
  featured_name: "Firecracker Jalapeño Smash",
  image:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
  price: 8.99,
  original_price: 12.99,
  tag: "spicy",
  status: "AVAILABLE",
  review_count: 184,
  total_rating: 902,
};

const TAG_STYLE = {
  spicy: { label: "SPICY", bg: "var(--tag-spicy)" },
  hot: { label: "HOT DEAL", bg: "var(--tag-hot)" },
  veggie: { label: "FRESH", bg: "var(--tag-veggie)" },
};

// Đọc Banner đang kích hoạt từ localStorage
function getStoredHeroBanner() {
  try {
    const saved = localStorage.getItem("active_customer_hero_banner");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Banner chính trang chủ (nhận prop banner khi xem trước ở Admin, hoặc tự đọc localStorage ở CustomerHomePage)
export default function HeroSection({ banner }) {
  const [storedBanner, setStoredBanner] = useState(getStoredHeroBanner);

  // Đồng bộ tự động khi Admin xuất bản Banner ở tab khác
  useEffect(() => {
    const syncStorage = () => setStoredBanner(getStoredHeroBanner());
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const data = { ...DEFAULT_HERO_BANNER, ...(banner || storedBanner || {}) };
  const price = Number(data.price) || 0;
  const originalPrice = Number(data.original_price) || 0;

  // Tính % giảm giá và điểm đánh giá trung bình
  const discountPercent =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const reviewCount = Number(data.review_count) || 0;
  const totalRating = Number(data.total_rating) || 0;
  const avgRating =
    reviewCount > 0
      ? Math.min(5, Math.max(1, totalRating / reviewCount)).toFixed(1)
      : "5.0";

  const tagInfo = TAG_STYLE[data.tag] || TAG_STYLE.hot;

  return (
    <section className="bg-[var(--bg-hero)] border-b border-[var(--border-light)] py-10 lg:py-16 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Nội dung bên trái */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex mt-4 items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--btn-primary-default)]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[var(--btn-primary-default)] uppercase">
              <Flame size={14} /> {data.hero_badge}
            </div>

            <h1 className="text-[var(--text-primary)] text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              {data.headline_main} <br />
              <span className="text-[var(--btn-primary-default)]">
                {data.headline_highlight}
              </span>{" "}
              {data.headline_sub}
            </h1>

            <p className="text-[var(--text-secondary)] text-base sm:text-lg font-medium max-w-xl">
              {data.description}
            </p>

            {/* Nút hành động chính & phụ */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={data.primary_cta_link || "#menu-section"}
                className="bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] px-8 py-4 font-black text-base uppercase tracking-wider transition-all shadow-[var(--shadow-md)] inline-flex items-center gap-2 rounded-full"
              >
                {data.primary_cta_text} <ChevronRight size={18} />
              </a>

              <a
                href={data.secondary_cta_link || "#hot-combos"}
                className="bg-[var(--btn-secondary-default)] hover:bg-[var(--btn-secondary-hover)] active:bg-[var(--btn-secondary-active)] text-[var(--text-inverse)] px-6 py-4 font-bold text-base uppercase tracking-wider transition-all shadow-[var(--shadow-sm)] inline-flex items-center gap-2 rounded-full"
              >
                {data.secondary_cta_text}
              </a>
            </div>

            {/* Thông tin nổi bật phụ */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Clock
                  size={16}
                  className="text-[var(--btn-primary-default)]"
                />{" "}
                {data.delivery_subtext}
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  size={16}
                  className="text-[var(--status-success)]"
                />{" "}
                {data.quality_subtext}
              </div>
              {reviewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Star
                    size={15}
                    className="text-[var(--color-rating-star)] fill-[var(--color-rating-star)]"
                  />
                  <span>
                    {avgRating} ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Khối hình ảnh món nổi bật bên phải */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 border-4 border-[var(--bg-surface)] shadow-[var(--shadow-lg)] bg-[var(--bg-surface)] p-2">
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span
                  style={{ backgroundColor: tagInfo.bg }}
                  className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-[var(--text-inverse)] shadow-[var(--shadow-sm)]"
                >
                  {tagInfo.label}
                </span>
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)] border border-[var(--border-active)]/30 shadow-[var(--shadow-sm)]">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {data.status && data.status !== "AVAILABLE" && (
                <div className="absolute inset-0 z-20 bg-[var(--bg-overlay)] flex items-center justify-center">
                  <span className="px-5 py-2 rounded-full bg-[var(--status-error)] text-[var(--text-inverse)] font-black text-sm uppercase tracking-wider">
                    {data.status === "SOLD_OUT" ? "Sold Out" : "Unavailable"}
                  </span>
                </div>
              )}

              <img
                src={data.image}
                alt={data.featured_name}
                className="w-full h-[340px] sm:h-[400px] object-cover bg-[var(--bg-subtle)]"
              />

              <div className="bg-[var(--text-primary)] text-[var(--text-inverse)] p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[var(--btn-secondary-default)] text-xs font-bold block uppercase tracking-widest truncate">
                    {data.featured_badge}
                  </span>
                  <span className="font-black text-lg text-[var(--text-inverse)] block truncate">
                    {data.featured_name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  {originalPrice > price && (
                    <span className="text-xs text-[var(--border-light)] line-through block">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-2xl font-black text-[var(--btn-secondary-default)]">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  Flame,
  ChevronRight,
  Clock,
  ShieldCheck,
  Star,
  Sparkles,
  Eye,
  X,
} from "lucide-react";

const TAG_STYLE = {
  spicy: { label: "SPICY", bg: "var(--tag-spicy)" },
  hot: { label: "HOT DEAL", bg: "var(--tag-hot)" },
  veggie: { label: "FRESH", bg: "var(--tag-veggie)" },
};

export function BannerLivePreview({ banner }) {
  if (!banner) return null;

  const price = Number(banner.price) || 0;
  const originalPrice = Number(banner.original_price) || 0;
  const discountPercent =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const reviewCount = Number(banner.review_count) || 0;
  const totalRating = Number(banner.total_rating) || 0;
  const avgRating =
    reviewCount > 0
      ? Math.min(5, Math.max(1, totalRating / reviewCount)).toFixed(1)
      : "5.0";

  const tagInfo = TAG_STYLE[banner.tag] || TAG_STYLE.hot;

  return (
    <div className="w-full">
      {banner.top_promo_enabled && (
        <div className="bg-[var(--btn-primary-hover)] py-1.5 px-4 text-center text-xs font-semibold tracking-wider text-[var(--bg-hero)] flex items-center justify-center gap-2">
          <Sparkles
            size={14}
            className="animate-pulse text-[var(--btn-secondary-default)] shrink-0"
          />
          <span>{banner.top_promo_text}</span>
        </div>
      )}

      <section className="bg-[var(--bg-hero)] border-b border-[var(--border-light)] py-10 lg:py-14 relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--btn-primary-default)]/30 px-3.5 py-1 rounded-full text-xs font-bold text-[var(--btn-primary-default)] uppercase">
                <Flame size={14} /> {banner.hero_badge}
              </div>

              <h2 className="text-[var(--text-primary)] text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
                {banner.headline_main} <br />
                <span className="text-[var(--btn-primary-default)]">
                  {banner.headline_highlight}
                </span>{" "}
                {banner.headline_sub}
              </h2>

              <p className="text-[var(--text-secondary)] text-base sm:text-lg font-medium max-w-xl">
                {banner.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <span className="bg-[var(--btn-primary-default)] text-[var(--text-inverse)] px-7 py-3.5 font-black text-sm sm:text-base uppercase tracking-wider shadow-[var(--shadow-md)] inline-flex items-center gap-2 rounded-full">
                  {banner.primary_cta_text} <ChevronRight size={18} />
                </span>

                <span className="bg-[var(--btn-secondary-default)] text-[var(--text-inverse)] px-6 py-3.5 font-bold text-sm sm:text-base uppercase tracking-wider shadow-[var(--shadow-sm)] inline-flex items-center gap-2 rounded-full">
                  {banner.secondary_cta_text}
                </span>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Clock
                    size={16}
                    className="text-[var(--btn-primary-default)]"
                  />{" "}
                  {banner.delivery_subtext}
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    size={16}
                    className="text-[var(--status-success)]"
                  />{" "}
                  {banner.quality_subtext}
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

            {/* Right Featured Dish Card */}
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

                {banner.status && banner.status !== "AVAILABLE" && (
                  <div className="absolute inset-0 z-20 bg-[var(--bg-overlay)] flex items-center justify-center">
                    <span className="px-5 py-2 rounded-full bg-[var(--status-error)] text-[var(--text-inverse)] font-black text-sm uppercase tracking-wider">
                      {banner.status === "SOLD_OUT"
                        ? "Sold Out"
                        : "Unavailable"}
                    </span>
                  </div>
                )}

                <img
                  src={banner.image}
                  alt={banner.featured_name}
                  className="w-full h-[320px] sm:h-[360px] object-cover bg-[var(--bg-subtle)]"
                />

                <div className="bg-[var(--text-primary)] text-[var(--text-inverse)] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[var(--btn-secondary-default)] text-xs font-bold block uppercase tracking-widest truncate">
                      {banner.featured_badge}
                    </span>
                    <span className="font-black text-lg text-[var(--text-inverse)] block truncate">
                      {banner.featured_name}
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
    </div>
  );
}

export default function BannerPreviewModal({ banner, onClose }) {
  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[var(--bg-main)] w-full max-w-6xl overflow-hidden shadow-[var(--shadow-lg)] border-4 border-[var(--bg-dark)]">
        <div className="px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-[var(--btn-secondary-default)]" />
            <span className="font-black text-sm uppercase tracking-wider">
              Customer Homepage Fullscreen Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <X size={14} /> Close Preview
          </button>
        </div>

        <BannerLivePreview banner={banner} />
      </div>
    </div>
  );
}

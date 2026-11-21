import { Eye, X } from "lucide-react";
import TopHeader from "./TopHeader";
import HeroSection from "./HeroSection";

// Khung xem trước trực tiếp (tái sử dụng TopHeader và HeroSection)
export function BannerLivePreview({ banner }) {
  if (!banner) return null;

  return (
    <div className="w-full">
      <TopHeader
        promoText={banner.top_promo_text}
        enabled={banner.top_promo_enabled}
      />
      <HeroSection banner={banner} />
    </div>
  );
}

// Modal xem trước Banner toàn màn hình cho trang AdminSettingPage
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

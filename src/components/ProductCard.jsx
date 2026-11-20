import { Star, Plus, Flame, Sparkles, PackageX } from "lucide-react";
import { PRODUCT_STATUS } from "./productConstants";

const renderTagBadge = (tag) => {
  if (tag === "spicy")
    return (
      <span className="bg-[var(--color-danger,#d32f2f)] text-[var(--text-inverse,#ffffff)] px-2.5 py-0.5 text-xs font-bold rounded-full inline-flex items-center gap-1 shadow-[var(--shadow-sm)]">
        <Flame size={12} /> SPICY
      </span>
    );
  if (tag === "veggie")
    return (
      <span className="bg-[var(--color-success,#2e7d32)] text-[var(--text-inverse,#ffffff)] px-2.5 py-0.5 text-xs font-bold rounded-full inline-flex items-center gap-1 shadow-[var(--shadow-sm)]">
        <Sparkles size={12} /> FRESH
      </span>
    );
  return (
    <span className="bg-[var(--btn-secondary-default)] text-[var(--text-inverse,#ffffff)] px-2.5 py-0.5 text-xs font-bold rounded-full inline-flex items-center gap-1 shadow-[var(--shadow-sm)]">
      <Star size={12} fill="currentColor" /> HOT DEAL
    </span>
  );
};

export default function ProductCard({ product, onCustomize }) {
  const defaultSize = product?.sizes?.[0];
  // Món hết hàng: khách vẫn thấy nhưng không đặt được
  const isSoldOut = product.status === PRODUCT_STATUS.SOLD_OUT;

  return (
    <div className="bg-[var(--bg-surface,#ffffff)] border-2 border-[var(--border-light)] hover:border-[var(--btn-primary-default)] transition-all flex flex-col justify-between shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">
      <div>
        <div className="relative h-52 bg-[var(--bg-subtle)] overflow-hidden">
          <img
            src={product.image}
            alt={product.product_name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isSoldOut ? "grayscale opacity-60" : "hover:scale-105"
            }`}
          />
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-overlay)]/40">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--bg-dark)] text-[var(--text-inverse)] text-xs font-black uppercase tracking-wider shadow-[var(--shadow-md)]">
                <PackageX size={14} /> Sold Out
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            {renderTagBadge(product.tag)}
          </div>
          <div className="absolute top-3 right-3 bg-[var(--text-primary)]/80 backdrop-blur-sm text-[var(--text-inverse,#ffffff)] px-2 py-1 text-xs font-bold flex items-center gap-1 rounded">
            <Star
              size={12}
              fill="var(--btn-secondary-default)"
              className="text-[var(--btn-secondary-default)]"
            />
            {product.rating} ({product.review_count})
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-black text-lg text-[var(--text-primary)] mb-1.5 leading-snug">
            {product.product_name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-[var(--border-light)] mt-auto flex items-center justify-between pt-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] opacity-75 block">
            Starts from
          </span>
          <span className="text-2xl font-black text-[var(--btn-primary-default)]">
            ${defaultSize ? defaultSize.price.toFixed(2) : "0.00"}
          </span>
        </div>

        <div className="group">
          {isSoldOut ? (
            <button
              type="button"
              disabled
              className="bg-[var(--btn-primary-disabled)] text-[var(--text-inverse,#ffffff)] px-4 py-2.5 font-bold text-xs uppercase flex items-center gap-1.5 rounded-full cursor-not-allowed"
            >
              <PackageX size={16} /> Sold Out
            </button>
          ) : (
            <button
              onClick={() => onCustomize(product)}
              className="bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse,#ffffff)] px-4 py-2.5 font-bold text-xs uppercase transition flex items-center gap-1.5 shadow-[var(--shadow-sm)] rounded-full cursor-pointer group-hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            >
              <Plus size={16} /> Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { Check, Trash2 } from "lucide-react";

export default function BannerPresetCard({
  banner,
  isSelected,
  onSelect,
  onActivate,
  onDelete,
}) {
  const price = Number(banner.price) || 0;
  const originalPrice = Number(banner.original_price) || 0;

  return (
    <div
      onClick={() => onSelect(banner)}
      className={`p-4 border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 bg-[var(--bg-surface)] ${
        isSelected
          ? "border-[var(--border-active)] shadow-[var(--shadow-md)]"
          : "border-[var(--border-light)] hover:border-[var(--border-divider)] shadow-[var(--shadow-sm)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={banner.image}
          alt={banner.featured_name}
          className="w-20 h-20 object-cover border border-[var(--border-divider)] shrink-0 bg-[var(--bg-subtle)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {banner.is_active ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[var(--status-success)]/15 text-[var(--status-success)] border border-[var(--status-success)]/30">
                <Check size={11} /> Live on Homepage
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                Saved Preset
              </span>
            )}
          </div>

          <h3 className="font-black text-sm text-[var(--text-primary)] truncate">
            {banner.banner_title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
            Featured: <span className="font-bold">{banner.featured_name}</span>
          </p>
          <p className="text-xs font-black text-[var(--color-price)] mt-1">
            ${price.toFixed(2)}
            {originalPrice > price && (
              <span className="text-[11px] text-[var(--text-muted)] line-through font-normal ml-1.5">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-light)] text-xs">
        <span className="text-[11px] text-[var(--text-muted)]">
          Updated: {banner.updated_at}
        </span>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {!banner.is_active && (
            <button
              type="button"
              onClick={() => onActivate(banner.banner_id)}
              className="px-3 py-1 rounded-full font-bold text-[11px] uppercase bg-[var(--btn-accent-default)] hover:bg-[var(--btn-accent-hover)] text-[var(--text-inverse)] transition-colors cursor-pointer"
            >
              Set Active
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(banner.banner_id)}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--status-error)] hover:bg-[var(--bg-badge-discount)] transition-colors cursor-pointer"
            title="Delete Campaign"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

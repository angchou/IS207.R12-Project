const TAG_BADGE = {
  spicy: { label: "Spicy", bg: "var(--tag-spicy)" },
  hot: { label: "Hot Deal", bg: "var(--tag-hot)" },
  veggie: { label: "Fresh", bg: "var(--tag-veggie)" },
};

export default function BannerCatalogItem({
  item,
  type,
  isSelected,
  onSelectCombo,
  onSelectProductSize,
}) {
  const isCombo = type === "combo";
  const title = isCombo ? item.combo_name : item.product_name;
  const tagStyle = TAG_BADGE[item.tag] || TAG_BADGE.hot;

  return (
    <div
      className={`p-3.5 border-2 transition-all ${
        isSelected
          ? "border-[var(--border-active)] bg-[var(--bg-hero)]/40"
          : "border-[var(--border-light)] bg-[var(--bg-main)] hover:border-[var(--border-divider)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={item.image}
          alt={title}
          className="w-16 h-16 object-cover shrink-0 border border-[var(--border-divider)] bg-[var(--bg-subtle)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-[var(--text-inverse)] ${
                isCombo
                  ? "bg-[var(--btn-secondary-default)]"
                  : "bg-[var(--bg-dark)]"
              }`}
            >
              {isCombo ? "Combo Deal" : "Menu Item"}
            </span>
            {isCombo ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)]">
                {item.badge}
              </span>
            ) : (
              <span
                style={{ backgroundColor: tagStyle.bg }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-[var(--text-inverse)]"
              >
                {tagStyle.label}
              </span>
            )}
          </div>

          <h4 className="font-bold text-sm text-[var(--text-primary)] truncate mt-1">
            {title}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
            {item.description}
          </p>

          {isCombo ? (
            <div className="flex items-center justify-between mt-2">
              <div>
                <span className="text-sm font-black text-[var(--color-price)]">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-xs text-[var(--text-muted)] line-through ml-1.5">
                  ${item.original_price.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectCombo(item)}
                className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] transition-all cursor-pointer"
              >
                Feature on Banner
              </button>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {item.sizes.map((sz) => (
                <button
                  key={sz.product_size_id}
                  type="button"
                  onClick={() => onSelectProductSize(item, sz)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--bg-surface)] hover:bg-[var(--btn-primary-default)] text-[var(--text-primary)] hover:text-[var(--text-inverse)] border border-[var(--border-divider)] transition-colors cursor-pointer"
                >
                  {sz.size_name}:{" "}
                  <span className="font-black">${sz.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

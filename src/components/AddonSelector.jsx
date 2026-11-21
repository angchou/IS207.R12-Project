import { formatCurrency } from "../utils/cart";

// Dùng chung danh sách checkbox cho lúc thêm món và lúc sửa món trong giỏ.
export default function AddonSelector({
  options,
  selectedAddons,
  onChange,
  legend = "Optional add-ons",
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
        {legend}
      </legend>

      <div className="space-y-2">
        {options.map((addon) => {
          const checked = selectedAddons.some((item) => item.addon_id === addon.addon_id);

          return (
            <label
              key={addon.addon_id}
              className={`flex cursor-pointer items-center justify-between gap-3 border p-3 transition-colors ${
                checked
                  ? "border-[var(--btn-secondary-default)] bg-[var(--bg-subtle)]"
                  : "border-[var(--border-light)] hover:border-[var(--border-divider)]"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    // Bỏ chọn chỉ xóa addon này; giữ các addon còn lại.
                    const nextAddons = event.target.checked
                      ? [...selectedAddons, addon]
                      : selectedAddons.filter((item) => item.addon_id !== addon.addon_id);
                    onChange(nextAddons);
                  }}
                  className="h-4 w-4 shrink-0 accent-[var(--btn-secondary-default)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                />
                {addon.addon_name}
              </span>
              <span className="shrink-0 text-xs font-bold text-[var(--text-secondary)]">
                +{formatCurrency(addon.price)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

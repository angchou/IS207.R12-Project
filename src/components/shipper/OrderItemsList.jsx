import { Utensils, Layers, CreditCard, Award } from "lucide-react";

export default function OrderItemsList({ order, compact = false }) {
  const items = order?.items || [];

  if (compact) {
    return (
      <div className="bg-[var(--bg-main)] border border-[var(--border-light)] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-divider)] pb-1.5">
          <span className="flex items-center gap-1.5">
            <Utensils size={13} className="text-[var(--btn-primary-default)]" />
            ORDER_DETAIL ({items.length})
          </span>
        </div>

        <div className="space-y-1.5">
          {items.map((item) => {
            const displayName = item.product_name || item.combo_name;
            return (
              <div
                key={item.order_detail_id}
                className="flex items-start justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--btn-primary-default)] font-black text-[10px]">
                      x{item.quantity}
                    </span>
                    {displayName && (
                      <span className="font-bold text-[var(--text-primary)]">
                        {displayName}
                      </span>
                    )}
                    {item.size_name && (
                      <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                        ({item.size_name})
                      </span>
                    )}
                  </div>

                  {item.addons && item.addons.length > 0 && (
                    <p className="text-[11px] text-[var(--text-muted)] pl-7 mt-0.5">
                      +{" "}
                      {item.addons
                        .map(
                          (ad) =>
                            `${ad.addon_name} ($${ad.price.toFixed(2)})`
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>

                <span className="font-black text-[var(--color-price)] shrink-0">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] shadow-[var(--shadow-sm)]">
      {/* Header */}
      <div className="bg-[var(--bg-subtle)] px-5 py-4 border-b-2 border-[var(--border-divider)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Utensils size={18} className="text-[var(--btn-primary-default)]" />
          <h3 className="font-black text-sm uppercase tracking-wider text-[var(--text-primary)]">
            Order Items (ORDER_DETAIL & ADDON_ORDER_DETAIL)
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] text-xs font-black uppercase">
          {items.length} Line Item(s)
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y-2 divide-[var(--border-light)]">
        {items.map((item) => {
          const displayName = item.product_name || item.combo_name;
          return (
            <div
              key={item.order_detail_id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--bg-main)] transition-colors"
            >
              <div className="flex items-start gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={displayName || ""}
                    className="w-20 h-20 object-cover border-2 border-[var(--border-divider)] shrink-0 bg-[var(--bg-subtle)]"
                  />
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.combo_id !== null && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--btn-secondary-default)] text-[var(--text-inverse)]">
                        combo_id #{item.combo_id}
                      </span>
                    )}
                    {item.product_size_id !== null && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--bg-subtle)] text-[var(--btn-primary-default)] border border-[var(--border-divider)]">
                        product_size_id #{item.product_size_id}
                      </span>
                    )}
                    <span className="text-xs font-bold text-[var(--text-muted)] font-mono">
                      order_detail_id #{item.order_detail_id}
                    </span>
                  </div>

                  {displayName && (
                    <h4 className="font-black text-base text-[var(--text-primary)]">
                      {displayName}
                    </h4>
                  )}

                  <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-secondary)] flex-wrap">
                    {item.size_name && <span>Size: {item.size_name}</span>}
                    <span>unit_price: ${item.unit_price.toFixed(2)}</span>
                    <span className="text-[var(--btn-primary-default)]">
                      quantity: x{item.quantity}
                    </span>
                  </div>

                  {/* Add-ons from ADDON_ORDER_DETAIL */}
                  {item.addons && item.addons.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-black text-[var(--text-secondary)] flex items-center gap-1 mr-1">
                        <Layers
                          size={12}
                          className="text-[var(--btn-secondary-default)]"
                        />
                        Add-ons:
                      </span>
                      {item.addons.map((addon) => (
                        <span
                          key={addon.addon_order_detail_id}
                          className="px-2.5 py-0.5 rounded-full bg-[var(--bg-hero)] border border-[var(--border-divider)] text-[11px] font-bold text-[var(--text-primary)]"
                        >
                          + {addon.addon_name} (${addon.price.toFixed(2)})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border-light)] flex sm:flex-col justify-between items-center sm:items-end shrink-0">
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)]">
                  total
                </span>
                <span className="text-lg font-black text-[var(--color-price)]">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment & Loyalty Points Summary from ORDER table */}
      <div className="bg-[var(--bg-main)] p-5 border-t-2 border-[var(--border-divider)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {order.payment_name && (
            <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-2.5">
              <CreditCard
                size={18}
                className="text-[var(--btn-primary-default)] shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                  payment_name
                </span>
                <span className="font-black text-[var(--text-primary)]">
                  {order.payment_name}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-2.5">
            <Award
              size={18}
              className="text-[var(--status-success)] shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                earned_point
              </span>
              <span className="font-black text-[var(--status-success)]">
                +{order.earned_point}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-light)] flex items-center gap-2.5">
            <Award
              size={18}
              className="text-[var(--btn-secondary-default)] shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                used_point
              </span>
              <span className="font-black text-[var(--text-secondary)]">
                {order.used_point}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-divider)] flex items-center justify-between gap-2">
          <span className="text-xs font-black uppercase text-[var(--text-primary)]">
            ORDER.total:
          </span>
          <div className="text-2xl font-black text-[var(--color-price)]">
            ${order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

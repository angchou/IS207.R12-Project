import { useId, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { MOCK_ADDONS } from "../data/mockData";
import { useCartStore } from "../store/useCartStore";
import { formatCurrency, getItemTotal } from "../utils/cart";
import AddonSelector from "./AddonSelector";
import Dialog from "./Dialog";
import QuantitySelector from "./QuantitySelector";

export default function EditCartItemDialog({ item, onClose }) {
  const titleId = useId();
  const updateItem = useCartStore((state) => state.updateItem);

  // Giữ bản nháp riêng: bấm Cancel hoặc Escape sẽ bỏ phần đang sửa.
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedAddons, setSelectedAddons] = useState(item.addons || []);
  const [error, setError] = useState("");

  const total = getItemTotal({ ...item, quantity, addons: selectedAddons });

  // Món lẻ dùng cùng danh sách addon với Home/Menu. Combo hiện chỉ đổi số lượng.
  // Ưu tiên bản ghi addon đã lưu trong giỏ để giữ tên và giá của lựa chọn cũ.
  const addonOptions = new Map();
  if (item.type === "product") {
    for (const addon of [...MOCK_ADDONS, ...(item.addons || [])]) {
      addonOptions.set(addon.addon_id, addon);
    }
  }

  const handleSave = () => {
    const saved = updateItem(item.cart_detail_id, { quantity, addons: selectedAddons });
    if (!saved) {
      setError("Couldn't save this item. Check its quantity and try again.");
      return;
    }
    onClose();
  };

  return (
    <Dialog onClose={onClose} labelledBy={titleId}>
      <header className="flex items-center justify-between gap-3 bg-[var(--bg-dark)] p-4 text-[var(--text-inverse)]">
        <h2 id={titleId} className="font-black uppercase tracking-wide">Edit cart item</h2>
        <button
          type="button"
          aria-label="Close item editor"
          onClick={onClose}
          className="shrink-0 rounded-full p-2 hover:bg-[var(--btn-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">
        {/* Tên, ảnh và size cho biết đúng dòng món đang sửa. */}
        <div className="flex items-center gap-4 border border-[var(--border-light)] bg-[var(--bg-main)] p-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
            {item.image ? (
              <img src={item.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <ShoppingBag size={24} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="wrap-break-word font-black text-[var(--text-primary)]">{item.name}</p>
            {item.size_name && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.size_name}</p>
            )}
          </div>
        </div>

        {/* Thay đổi số lượng và addon trên bản nháp để xem trước thành tiền. */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-wider">Quantity</p>
          <QuantitySelector quantity={quantity} onChange={setQuantity} itemName={item.name} />
        </div>

        {addonOptions.size > 0 && (
          <AddonSelector
            options={[...addonOptions.values()]}
            selectedAddons={selectedAddons}
            onChange={setSelectedAddons}
            legend="Add-ons per serving"
          />
        )}
      </div>

      {/* Chỉ nút Save mới ghi các lựa chọn vào giỏ hàng dùng chung. */}
      <footer className="space-y-3 border-t border-[var(--border-light)] bg-[var(--bg-main)] p-4">
        {error && <p role="alert" className="text-sm text-[var(--status-error)]">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Item total</p>
            <p aria-live="polite" className="text-xl font-black tabular-nums text-[var(--color-price)]">
              {formatCurrency(total)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[var(--border-divider)] px-4 py-3 text-xs font-bold uppercase text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[var(--btn-primary-default)] px-5 py-3 text-xs font-black uppercase text-[var(--text-inverse)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              Save changes
            </button>
          </div>
        </div>
      </footer>
    </Dialog>
  );
}

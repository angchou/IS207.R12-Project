import { ShoppingBag, X } from "lucide-react";
import { MOCK_ADDONS } from "../data/mockData";
import { useCartStore } from "../store/useCartStore";
import { formatCurrency, getItemUnitPrice } from "../utils/cart";
import AddonSelector from "./AddonSelector";
import Dialog from "./Dialog";

export default function CustomizerModal({
  product,
  selectedSize,
  setSelectedSize,
  selectedAddons,
  setSelectedAddons,
  onClose,
  setIsCartOpen,
}) {
  // 1. Lưu món theo product_size_id và danh sách addon vào cùng giỏ với trang Cart.
  const addProduct = useCartStore((state) => state.addProduct);

  const handleAddToCartFromModal = () => {
    if (!product || !selectedSize) return;
    addProduct(product, selectedSize, selectedAddons);
    onClose();
    setIsCartOpen(true);
  };

  // 2. Dùng chung cách tính tiền: giá size + giá từng món thêm.
  const currentTotal = getItemUnitPrice({
    unit_price: selectedSize?.price || 0,
    addons: selectedAddons,
  });

  return (
    <Dialog onClose={onClose} labelledBy="customizer-title">
      {/* 3. Tiêu đề cửa sổ; tất cả màu sắc lấy từ bảng màu global.css. */}
      <div className="flex items-center justify-between gap-3 bg-[var(--bg-dark)] p-4 text-[var(--text-inverse)]">
        <div>
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[var(--btn-secondary-default)]">
            Customize your meal
          </span>
          <h2 id="customizer-title" className="text-lg font-black">
            {product.product_name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close meal customizer"
          className="rounded-full p-2 hover:bg-[var(--btn-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 space-y-6 overflow-y-auto p-5 sm:p-6">
        <div className="flex items-center gap-4 border border-[var(--border-light)] bg-[var(--bg-main)] p-3">
          <img src={product.image} alt={product.product_name} className="h-20 w-20 shrink-0 object-cover" />
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            {product.description}
          </p>
        </div>

        {/* 4. Radio cho phép chọn đúng một size; vẫn dùng được bằng bàn phím. */}
        <fieldset>
          <legend className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
            1. Select serving size
          </legend>
          <div className="space-y-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize?.product_size_id === size.product_size_id;
              return (
                <label
                  key={size.product_size_id}
                  className={`flex cursor-pointer items-center justify-between gap-3 border-2 p-3 transition-colors ${
                    isSelected
                      ? "border-[var(--btn-primary-default)] bg-[var(--bg-badge-discount)]"
                      : "border-[var(--border-light)] hover:border-[var(--border-divider)]"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                    <input
                      type="radio"
                      name="serving-size"
                      value={size.product_size_id}
                      checked={isSelected}
                      onChange={() => setSelectedSize(size)}
                      className="h-4 w-4 shrink-0 accent-[var(--btn-primary-default)] focus:ring-2 focus:ring-[var(--focus-ring)]"
                    />
                    {size.size_name}
                  </span>
                  <span className="shrink-0 text-sm font-black text-[var(--color-price)]">
                    {formatCurrency(size.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* 5. Dùng cùng cách chọn món thêm với popup sửa món trong giỏ. */}
        <AddonSelector
          options={MOCK_ADDONS}
          selectedAddons={selectedAddons}
          onChange={setSelectedAddons}
          legend="2. Choose optional add-ons"
        />
      </div>

      {/* 6. Xác nhận chỉ thêm vào giỏ, giữ nguyên size/addon đã chọn khi đổi trang. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-light)] bg-[var(--bg-main)] p-4">
        <div>
          <span className="block text-[10px] font-bold uppercase text-[var(--text-muted)]">Item total</span>
          <span aria-live="polite" className="text-2xl font-black text-[var(--color-price)]">
            {formatCurrency(currentTotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCartFromModal}
          disabled={!selectedSize}
          className="flex items-center gap-2 rounded-full bg-[var(--btn-primary-default)] px-6 py-3 text-xs font-bold uppercase text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--btn-primary-hover)] disabled:cursor-not-allowed disabled:bg-[var(--btn-primary-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          <ShoppingBag size={16} aria-hidden="true" /> Confirm & add to cart
        </button>
      </div>
    </Dialog>
  );
}

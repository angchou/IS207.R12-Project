import React from "react";
import { X, ShoppingBag } from "lucide-react";
import { MOCK_ADDONS } from "../data/mockData"; // Đảm bảo đường dẫn đúng

export default function CustomizerModal({
  product,
  selectedSize,
  setSelectedSize,
  selectedAddons,
  setSelectedAddons,
  onClose,
  setCart,
  setIsCartOpen,
}) {
  const handleAddToCartFromModal = () => {
    if (!product || !selectedSize) return;
    const newItem = {
      cart_id: Date.now(),
      type: "product",
      product_id: product.product_id,
      name: product.product_name,
      size_name: selectedSize.size_name,
      unit_price: selectedSize.price,
      quantity: 1,
      addons: [...selectedAddons],
    };
    setCart((prev) => [...prev, newItem]);
    onClose();
    setIsCartOpen(true);
  };

  const currentTotal =
    (selectedSize ? selectedSize.price : 0) +
    selectedAddons.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#230b0b]/80 backdrop-blur-xs">
      <div className="bg-white max-w-lg w-full border-4 border-[#230b0b] shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-[#230b0b] text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-300 uppercase font-extrabold tracking-widest block">
              Customize Your Meal
            </span>
            <h3 className="font-black text-lg text-white">
              {product.product_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 text-amber-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex gap-4 items-center bg-[#fff8f0] p-3 border border-[#f3e1d3]">
            <img
              src={product.image}
              alt={product.product_name}
              className="w-20 h-20 object-cover"
            />
            <p className="text-xs text-[#5c3d35]">{product.description}</p>
          </div>

          {/* Size Options */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#1f0a08] block mb-2">
              1. Select Serving Size <span className="text-[#c8102e]">*</span>
            </label>
            <div className="space-y-2">
              {product.sizes.map((sizeObj) => {
                const isSelected =
                  selectedSize?.product_size_id === sizeObj.product_size_id;
                return (
                  <div
                    key={sizeObj.product_size_id}
                    onClick={() => setSelectedSize(sizeObj)}
                    className={`p-3 border-2 cursor-pointer flex items-center justify-between transition-all ${isSelected ? "border-[#c8102e] bg-[#ffebee]" : "border-[#f3e1d3] hover:border-[#e6ccba]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#c8102e] bg-[#c8102e]" : "border-gray-400"}`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-bold text-sm text-[#1f0a08]">
                        {sizeObj.size_name}
                      </span>
                    </div>
                    <span className="font-black text-sm text-[#c8102e]">
                      ${sizeObj.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add-ons List */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-[#1f0a08] block mb-2">
              2. Choose Optional Add-Ons
            </label>
            <div className="space-y-2">
              {MOCK_ADDONS.map((addon) => {
                const isChecked = selectedAddons.some(
                  (a) => a.addon_id === addon.addon_id,
                );
                return (
                  <div
                    key={addon.addon_id}
                    onClick={() => {
                      isChecked
                        ? setSelectedAddons((prev) =>
                            prev.filter((a) => a.addon_id !== addon.addon_id),
                          )
                        : setSelectedAddons((prev) => [...prev, addon]);
                    }}
                    className={`p-3 border cursor-pointer flex items-center justify-between ${isChecked ? "border-[#ff9800] bg-[#fff0e0]" : "border-[#f3e1d3] hover:border-[#e6ccba]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 border flex items-center justify-center ${isChecked ? "bg-[#ff9800] border-[#ff9800]" : "border-gray-400"}`}
                      >
                        {isChecked && <X size={12} className="text-white" />}
                      </div>
                      <span className="font-medium text-xs text-[#1f0a08]">
                        {addon.addon_name}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-[#5c3d35]">
                      +${addon.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#fff8f0] border-t border-[#f3e1d3] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#9e7d75] font-bold block uppercase">
              Item Total
            </span>
            <span className="text-2xl font-black text-[#c8102e]">
              ${currentTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCartFromModal}
            style={{ backgroundColor: "var(--btn-primary-default, #c8102e)" }}
            className="px-6 py-3 font-bold text-xs uppercase text-white hover:bg-[#a50b23] transition-colors flex items-center gap-2 shadow rounded-full"
          >
            <ShoppingBag size={16} /> Confirm & Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

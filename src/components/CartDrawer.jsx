import React from "react";
import { ShoppingBag, X, CheckCircle2, Minus, Plus } from "lucide-react";

export default function CartDrawer({
  cart,
  setCart,
  onClose,
  orderFulfilled,
  setOrderFulfilled,
}) {
  const calculateCartSubtotal = () => {
    return cart.reduce((sum, item) => {
      const addonTotal = item.addons
        ? item.addons.reduce((a, b) => a + b.price, 0)
        : 0;
      return sum + (item.unit_price + addonTotal) * item.quantity;
    }, 0);
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cart_id === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#230b0b]/70 backdrop-blur-xs"
        onClick={onClose}
      ></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l-4 border-[#230b0b] shadow-2xl flex flex-col justify-between">
          <div className="bg-[#230b0b] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} style={{ color: "#ff9800" }} />
              <h2 className="font-black text-lg text-white uppercase tracking-wider">
                Your Food Order
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-amber-200 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {orderFulfilled ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-[#2e7d32]" />
                <h3 className="font-black text-xl text-[#1f0a08]">
                  ORDER PLACED SUCCESSFULLY!
                </h3>
                <p className="text-xs text-[#5c3d35]">
                  Your order is being freshly prepared by our kitchen. Track
                  status in your account!
                </p>
                <div className="bg-[#fff0e0] p-3 text-xs font-bold text-[#c8102e]">
                  Points Earned: +{Math.floor(calculateCartSubtotal() * 10)} PTS
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag size={40} className="mx-auto text-[#9e7d75]" />
                <p className="text-sm font-bold text-[#5c3d35]">
                  Your shopping cart is currently empty.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#c8102e] text-white text-xs font-bold uppercase rounded-full"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const addonSum = item.addons
                  ? item.addons.reduce((a, b) => a + b.price, 0)
                  : 0;
                const itemTotal = (item.unit_price + addonSum) * item.quantity;
                return (
                  <div
                    key={item.cart_id}
                    className="p-4 border-2 border-[#f3e1d3] bg-[#fff8f0] relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-black text-sm text-[#1f0a08]">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-bold text-[#5c3d35] block">
                          Size: {item.size_name}
                        </span>
                      </div>
                      <span className="font-black text-sm text-[#c8102e]">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                    {item.addons && item.addons.length > 0 && (
                      <div className="text-[10px] text-[#9e7d75] mb-3 space-y-0.5">
                        {item.addons.map((ad, idx) => (
                          <div key={idx}>
                            + {ad.addon_name} (${ad.price.toFixed(2)})
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-[#e6ccba]">
                      <div className="flex items-center border border-[#e6ccba] bg-white">
                        <button
                          onClick={() => updateQuantity(item.cart_id, -1)}
                          className="p-1 hover:bg-gray-100 text-[#1f0a08]"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-black text-[#1f0a08]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_id, 1)}
                          className="p-1 hover:bg-gray-100 text-[#1f0a08]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          updateQuantity(item.cart_id, -item.quantity)
                        }
                        className="text-[10px] font-bold text-[#c8102e] hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!orderFulfilled && cart.length > 0 && (
            <div className="p-5 bg-[#fff0e0] border-t border-[#e6ccba] space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#5c3d35]">
                  <span>Food Subtotal</span>
                  <span className="font-bold">
                    ${calculateCartSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#5c3d35]">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-[#2e7d32]">FREE</span>
                </div>
                <div className="flex justify-between text-[#1f0a08] font-black text-base pt-2 border-t border-[#e6ccba]">
                  <span>Total Payment</span>
                  <span className="text-[#c8102e]">
                    ${calculateCartSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-[#ffebee] border border-[#c8102e]/30 p-2 text-[11px] text-[#c8102e] font-bold flex items-center justify-between">
                <span>Loyalty Points to Earn:</span>
                <span>+{Math.floor(calculateCartSubtotal() * 10)} PTS</span>
              </div>
              <button
                onClick={() => {
                  setOrderFulfilled(true);
                  setTimeout(() => {
                    setCart([]);
                  }, 2500);
                }}
                style={{
                  backgroundColor: "var(--btn-primary-default, #c8102e)",
                }}
                className="w-full py-3.5 font-black text-sm uppercase tracking-wider text-white hover:bg-[#a50b23] transition-colors shadow-lg rounded-full"
              >
                Place Delivery Order Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

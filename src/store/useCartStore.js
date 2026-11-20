import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Hai lần chọn cùng size và cùng bộ món thêm sẽ được gộp thành một dòng.
// Sắp xếp ID giúp thứ tự bấm chọn món thêm không làm xuất hiện dòng trùng.
function getAddonKey(addons = []) {
  return addons
    .map((addon) => addon.addon_id)
    .sort((first, second) => first - second)
    .join(",");
}

// Giữ giá ở độ chính xác hai chữ số thập phân như DECIMAL(18, 2) trong DB.
function normalizePrice(price) {
  return Math.round(Number(price) * 100) / 100;
}

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function isValidPrice(price) {
  return Number.isFinite(Number(price)) && Number(price) >= 0;
}

// Mỗi addon chỉ được chọn một lần cho mỗi suất. Dùng cùng cách lưu khi thêm và sửa.
function normalizeAddons(addons) {
  const uniqueAddons = new Map();
  for (const addon of Array.isArray(addons) ? addons : []) {
    if (isValidId(addon?.addon_id) && isValidPrice(addon?.price)) {
      uniqueAddons.set(addon.addon_id, { ...addon, price: normalizePrice(addon.price) });
    }
  }
  return [...uniqueAddons.values()];
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Home, Menu, giỏ thu gọn và trang Cart cùng đọc một danh sách này.
      cart: [],
      nextDetailId: 1,

      // Thêm món theo PRODUCT_SIZE; lưu nguyên size và món thêm khách đã chọn.
      addProduct: (product, selectedSize, addons = []) => {
        if (
          !isValidId(product?.product_id) ||
          !isValidId(selectedSize?.product_size_id) ||
          !isValidPrice(selectedSize?.price)
        ) {
          return;
        }

        const selectedAddons = normalizeAddons(addons);
        const addonKey = getAddonKey(selectedAddons);

        set((state) => {
          const existingItem = state.cart.find(
            (item) =>
              item.type === "product" &&
              item.product_size_id === selectedSize.product_size_id &&
              getAddonKey(item.addons) === addonKey,
          );

          if (existingItem) {
            const quantity = existingItem.quantity + 1;
            if (!Number.isSafeInteger(quantity)) return state;

            return {
              cart: state.cart.map((item) =>
                item.cart_detail_id === existingItem.cart_detail_id
                  ? { ...item, quantity }
                  : item,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                // Tên khóa theo CART_DETAIL; đây là ID cục bộ cho đến khi có API.
                cart_detail_id: state.nextDetailId,
                type: "product",
                product_size_id: selectedSize.product_size_id,
                combo_id: null,
                product_id: product.product_id,
                name: product.product_name,
                image: product.image || "",
                size_name: selectedSize.size_name,
                unit_price: normalizePrice(selectedSize.price),
                addons: selectedAddons,
                quantity: 1,
              },
            ],
            nextDetailId: state.nextDetailId + 1,
          };
        });
      },

      // Combo dùng combo_id; không ghi product_size_id của một món riêng lẻ.
      addCombo: (combo) => {
        if (!isValidId(combo?.combo_id) || !isValidPrice(combo?.price)) return;

        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.type === "combo" && item.combo_id === combo.combo_id,
          );

          if (existingItem) {
            const quantity = existingItem.quantity + 1;
            if (!Number.isSafeInteger(quantity)) return state;

            return {
              cart: state.cart.map((item) =>
                item.cart_detail_id === existingItem.cart_detail_id
                  ? { ...item, quantity }
                  : item,
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                cart_detail_id: state.nextDetailId,
                type: "combo",
                product_size_id: null,
                combo_id: combo.combo_id,
                name: combo.combo_name,
                image: combo.image || "",
                size_name: "Standard Combo Box",
                unit_price: normalizePrice(combo.price),
                addons: [],
                quantity: 1,
              },
            ],
            nextDetailId: state.nextDetailId + 1,
          };
        });
      },

      // Nhận số lượng mới, chỉ cho phép số nguyên từ 1 trở lên.
      // Giảm tại mức 1 không tự xóa món; khách dùng nút Xóa riêng.
      updateQuantity: (cartDetailId, quantity) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1) return;

        set((state) => ({
          cart: state.cart.map((item) =>
            item.cart_detail_id === cartDetailId ? { ...item, quantity } : item,
          ),
        }));
      },

      // Lưu số lượng và addon cùng lúc để Cart, Drawer và Checkout thấy cùng kết quả.
      updateItem: (cartDetailId, { quantity, addons }) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1) return false;

        const { cart } = get();
        const item = cart.find((row) => row.cart_detail_id === cartDetailId);
        if (!item) return false;

        const isProduct = item.type === "product";
        const updatedAddons = isProduct ? normalizeAddons(addons) : (item.addons ?? []);
        const addonKey = getAddonKey(updatedAddons);

        // Nếu lựa chọn mới trùng một dòng khác, gộp số lượng và giữ lại dòng đang sửa.
        const matchingItem = isProduct
          ? cart.find(
              (row) =>
                row.cart_detail_id !== cartDetailId &&
                row.type === "product" &&
                row.product_size_id === item.product_size_id &&
                getAddonKey(row.addons) === addonKey,
            )
          : undefined;
        const newQuantity = quantity + (matchingItem?.quantity ?? 0);
        if (!Number.isSafeInteger(newQuantity)) return false;

        const updatedItem = { ...item, quantity: newQuantity, addons: updatedAddons };
        set({
          cart: cart
            .filter((row) => row !== matchingItem)
            .map((row) => row === item ? updatedItem : row),
        });
        return true;
      },

      // Xóa đúng dòng theo cart_detail_id, giữ nguyên các lựa chọn còn lại.
      removeItem: (cartDetailId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.cart_detail_id !== cartDetailId,
          ),
        })),

      // Dành cho luồng đặt hàng sau này; không đặt lại bộ đếm ID đã sử dụng.
      clearCart: () => set({ cart: [] }),
    }),
    {
      // Lưu trên trình duyệt để giỏ vẫn còn khi đổi trang hoặc tải lại website.
      name: "food-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        nextDetailId: state.nextDetailId,
      }),
    },
  ),
);

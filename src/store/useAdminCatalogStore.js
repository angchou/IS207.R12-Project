import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  MOCK_ADDONS,
  MOCK_ADDON_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_PRODUCT_ADDONS,
  MOCK_SIZES,
  MOCK_COMBOS,
  MOCK_COMBO_DETAILS,
} from "../data/mockData";

// Store dùng chung cho các trang quản lý danh mục (Admin Add-on, Product, Combo) và trang Customer (Home, Menu)
// Chưa gọi API: dữ liệu lưu vào localStorage để Admin đổi gì thì Customer thấy ngay, F5 vẫn giữ
// Giữ đúng cấu trúc bảng trong database.txt và cấu trúc MOCK_PRODUCTS (có sizes đã join)

const STORAGE_KEY = "admin_catalog_store_v1";

// localStorage an toàn: bỏ qua lỗi khi trình duyệt chặn hoặc đầy bộ nhớ (ví dụ ảnh base64 quá lớn)
const safeLocalStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Bỏ qua nếu đầy bộ nhớ trình duyệt
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Bỏ qua
    }
  },
};

// Lấy id lớn nhất của một danh sách theo khóa chính rồi cộng 1
const nextIdOf = (list, key) =>
  list.reduce((max, item) => Math.max(max, item[key] || 0), 0) + 1;

// Thời gian hiện tại theo định dạng TIMESTAMP của mock: "YYYY-MM-DD HH:mm:ss"
function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Dựng mảng sizes (PRODUCT_SIZE join SIZE) cho một món, giữ product_size_id cũ nếu size đã tồn tại
// Sắp theo size_id để sizes[0] luôn là size nhỏ nhất (Customer dùng cho "Starts from")
function buildProductSizes(productId, sizeInputs, existingSizes, allProducts) {
  let nextSizeId = nextIdOf(
    allProducts.flatMap((p) => p.sizes || []),
    "product_size_id",
  );

  return [...sizeInputs]
    .sort((a, b) => a.size_id - b.size_id)
    .map(({ size_id, price }) => {
      const existing = existingSizes.find((s) => s.size_id === size_id);
      return {
        product_size_id: existing ? existing.product_size_id : nextSizeId++,
        size_id,
        product_id: productId,
        price,
        size_name:
          MOCK_SIZES.find((s) => s.size_id === size_id)?.size_name || null,
      };
    });
}

// Thay toàn bộ dòng COMBO_DETAIL của một combo
// Bảng COMBO_DETAIL không có cột số lượng: mỗi phần là 1 dòng, số lượng 2 = 2 dòng cùng product_size_id
function replaceComboDetails(comboDetails, comboId, items) {
  const kept = comboDetails.filter((cd) => cd.combo_id !== comboId);
  let nextId = nextIdOf(comboDetails, "combo_detail_id");
  const added = items.flatMap(({ product_size_id, quantity }) =>
    Array.from({ length: quantity }, () => ({
      combo_detail_id: nextId++,
      combo_id: comboId,
      product_size_id,
    })),
  );
  return [...kept, ...added];
}

// Thay toàn bộ dòng PRODUCT_ADDON của một món bằng danh sách addonIds mới
function replaceProductAddons(productAddons, productId, addonIds) {
  const kept = productAddons.filter((pa) => pa.product_id !== productId);
  let nextId = nextIdOf(productAddons, "product_addon_id");
  const added = addonIds.map((addon_id) => ({
    product_addon_id: nextId++,
    product_id: productId,
    addon_id,
  }));
  return [...kept, ...added];
}

export const useAdminCatalogStore = create(
  persist(
    (set, get) => ({
      addons: MOCK_ADDONS,
      addonCategories: MOCK_ADDON_CATEGORIES,
      products: MOCK_PRODUCTS,
      productCategories: MOCK_CATEGORIES,
      productAddons: MOCK_PRODUCT_ADDONS,
      combos: MOCK_COMBOS,
      comboDetails: MOCK_COMBO_DETAILS,

      // ===================== ADD-ON =====================
      addAddon: (values) => {
        const addonId = nextIdOf(get().addons, "addon_id");
        set((state) => ({
          addons: [{ addon_id: addonId, ...values }, ...state.addons],
        }));
        return addonId;
      },

      updateAddon: (addonId, values) =>
        set((state) => ({
          addons: state.addons.map((a) =>
            a.addon_id === addonId ? { ...a, ...values } : a,
          ),
        })),

      // Xóa add-on và các liên kết PRODUCT_ADDON trỏ tới nó
      deleteAddon: (addonId) =>
        set((state) => ({
          addons: state.addons.filter((a) => a.addon_id !== addonId),
          productAddons: state.productAddons.filter(
            (pa) => pa.addon_id !== addonId,
          ),
        })),

      addAddonCategory: (categoryName) => {
        const categoryId = nextIdOf(get().addonCategories, "category_id");
        set((state) => ({
          addonCategories: [
            ...state.addonCategories,
            { category_id: categoryId, category_name: categoryName },
          ],
        }));
        return categoryId;
      },

      // ===================== PRODUCT =====================
      addProduct: (values, sizeInputs, addonIds) => {
        const { products, productAddons } = get();
        const productId = nextIdOf(products, "product_id");
        const newProduct = {
          product_id: productId,
          ...values,
          created_at: formatTimestamp(),
          review_count: 0,
          total_rating: 0,
          sizes: buildProductSizes(productId, sizeInputs, [], products),
        };
        set({
          products: [newProduct, ...products],
          productAddons: replaceProductAddons(
            productAddons,
            productId,
            addonIds,
          ),
        });
        return productId;
      },

      updateProduct: (productId, values, sizeInputs, addonIds) => {
        const { products, productAddons } = get();
        set({
          products: products.map((p) =>
            p.product_id === productId
              ? {
                  ...p,
                  ...values,
                  sizes: buildProductSizes(
                    productId,
                    sizeInputs,
                    p.sizes || [],
                    products,
                  ),
                }
              : p,
          ),
          productAddons: replaceProductAddons(
            productAddons,
            productId,
            addonIds,
          ),
        });
      },

      // Đổi trạng thái món: AVAILABLE (có thể chọn) / SOLD_OUT (hết hàng) / UNAVAILABLE (chỉ Admin thấy)
      setProductStatus: (productId, status) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.product_id === productId ? { ...p, status } : p,
          ),
        })),

      addProductCategory: (categoryName) => {
        const categoryId = nextIdOf(get().productCategories, "category_id");
        set((state) => ({
          productCategories: [
            ...state.productCategories,
            { category_id: categoryId, category_name: categoryName },
          ],
        }));
        return categoryId;
      },

      // ===================== COMBO =====================
      // items = [{ product_size_id, quantity }]
      addCombo: (values, items) => {
        const { combos, comboDetails } = get();
        const comboId = nextIdOf(combos, "combo_id");
        const newCombo = {
          combo_id: comboId,
          ...values,
          created_at: formatTimestamp(),
          review_count: 0,
          total_rating: 0,
        };
        set({
          combos: [newCombo, ...combos],
          comboDetails: replaceComboDetails(comboDetails, comboId, items),
        });
        return comboId;
      },

      // Sửa combo: giữ combo_id, created_at, số đánh giá; thay toàn bộ COMBO_DETAIL
      updateCombo: (comboId, values, items) => {
        const { combos, comboDetails } = get();
        set({
          combos: combos.map((c) =>
            c.combo_id === comboId ? { ...c, ...values } : c,
          ),
          comboDetails: replaceComboDetails(comboDetails, comboId, items),
        });
      },

      // Đổi trạng thái combo: AVAILABLE (mở bán) <-> UNAVAILABLE (ngừng bán, khách không thấy)
      toggleComboStatus: (comboId) =>
        set((state) => ({
          combos: state.combos.map((c) =>
            c.combo_id === comboId
              ? {
                  ...c,
                  status:
                    c.status === "UNAVAILABLE" ? "AVAILABLE" : "UNAVAILABLE",
                }
              : c,
          ),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => safeLocalStorage),
      // Chỉ lưu dữ liệu, không lưu các hàm action
      partialize: (state) => ({
        addons: state.addons,
        addonCategories: state.addonCategories,
        products: state.products,
        productCategories: state.productCategories,
        productAddons: state.productAddons,
        combos: state.combos,
        comboDetails: state.comboDetails,
      }),
    },
  ),
);

// Đồng bộ giữa các tab trình duyệt: tab khác lưu thay đổi (ví dụ Admin đổi trạng thái món)
// thì tab này đọc lại dữ liệu ngay, không cần F5
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      useAdminCatalogStore.persist.rehydrate();
    }
  });
}

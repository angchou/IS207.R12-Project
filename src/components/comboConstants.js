import { PRODUCT_STATUS } from "./productConstants";

// Trạng thái combo (cột COMBO.status): chỉ có mở bán / ngừng bán
export const COMBO_STATUS = {
  AVAILABLE: "AVAILABLE", // Mở bán: khách thấy combo
  UNAVAILABLE: "UNAVAILABLE", // Ngừng bán: chỉ Admin thấy, ẩn với khách
};

// Gợi ý badge lấy từ các combo mẫu hiện có (cột COMBO.badge NOT NULL)
export const COMBO_BADGE_SUGGESTIONS = [
  "BEST SELLER",
  "SAVER COMBO",
  "FAMILY SIZE",
  "NIGHT DEAL",
  "NEW",
];

// Số lượng tối đa cho một món trong combo
export const MAX_ITEM_QUANTITY = 10;

// Tra cứu nhanh product_size_id -> { product, size } từ danh sách món (MOCK_PRODUCTS có sizes đã join)
export function buildSizeIndex(products) {
  const index = {};
  products.forEach((product) => {
    (product.sizes || []).forEach((size) => {
      index[size.product_size_id] = { product, size };
    });
  });
  return index;
}

// Gộp các dòng COMBO_DETAIL của một combo thành danh sách { product_size_id, quantity, product, size }
// (bảng không có cột số lượng nên mỗi dòng là 1 phần; 2 dòng cùng product_size_id = số lượng 2)
export function groupComboItems(comboId, comboDetails, sizeIndex) {
  const items = [];
  comboDetails
    .filter((cd) => cd.combo_id === comboId)
    .forEach((cd) => {
      const existing = items.find(
        (i) => i.product_size_id === cd.product_size_id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        const found = sizeIndex[cd.product_size_id];
        items.push({
          product_size_id: cd.product_size_id,
          quantity: 1,
          product: found?.product || null,
          size: found?.size || null,
        });
      }
    });
  return items;
}

// Món có được chọn vào combo / combo có đặt được không (chỉ món AVAILABLE)
export function isProductOrderable(product) {
  return Boolean(product) && product.status === PRODUCT_STATUS.AVAILABLE;
}

// Danh sách món làm combo không đặt được (món SOLD_OUT / UNAVAILABLE hoặc không còn tồn tại)
export function getComboBlockers(items) {
  const blockers = [];
  items.forEach((item) => {
    if (isProductOrderable(item.product)) return;
    const name = item.product?.product_name || "Removed item";
    const status = item.product?.status || "MISSING";
    if (!blockers.some((b) => b.name === name)) {
      blockers.push({ name, status });
    }
  });
  return blockers;
}

// Combo có hiện cho khách không (ngừng bán thì ẩn)
export function isComboVisibleToCustomer(combo) {
  return combo.status !== COMBO_STATUS.UNAVAILABLE;
}

// Tổng giá gốc của combo = Σ giá size × số lượng
export function sumItemsPrice(items) {
  return items.reduce(
    (sum, item) => sum + (item.size?.price || 0) * item.quantity,
    0,
  );
}

// Tạo mô tả combo từ danh sách món, theo kiểu mock: "2 Burger (Medium) + 1 Fries (Small)"
export function buildComboDescription(items) {
  return items
    .map((item) => {
      const name = item.product?.product_name || "Item";
      const size = item.size?.size_name ? ` (${item.size.size_name})` : "";
      return `${item.quantity} ${name}${size}`;
    })
    .join(" + ");
}

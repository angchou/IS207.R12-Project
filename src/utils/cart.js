// Đổi tiền sang cent trước khi tính toán để tránh sai số khi cộng số thập phân.
function toCents(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

function getQuantity(item) {
  const quantity = Number(item?.quantity);
  return Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0;
}

function getItemUnitPriceInCents(item) {
  const addons = Array.isArray(item?.addons) ? item.addons : [];
  return (
    toCents(item?.unit_price) +
    addons.reduce((total, addon) => total + toCents(addon.price), 0)
  );
}

// Giữ cách hiển thị USD giống giá món ăn và combo trên trang chủ.
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(toCents(amount) / 100);
}

// Giá một suất = giá theo kích cỡ (hoặc giá combo) + các món thêm đã chọn.
export function getItemUnitPrice(item) {
  return getItemUnitPriceInCents(item) / 100;
}

// Thành tiền của một dòng thay đổi theo số lượng món trong dòng đó.
export function getItemTotal(item) {
  return (getItemUnitPriceInCents(item) * getQuantity(item)) / 100;
}

// Cộng toàn bộ giỏ bằng cent rồi mới đổi lại sang USD để hiển thị.
export function getCartSubtotal(cart = []) {
  return (
    cart.reduce(
      (total, item) =>
        total + getItemUnitPriceInCents(item) * getQuantity(item),
      0,
    ) / 100
  );
}

// Số trên biểu tượng giỏ hàng là tổng số suất, không phải số dòng khác nhau.
export function getCartItemCount(cart = []) {
  return cart.reduce((total, item) => total + getQuantity(item), 0);
}

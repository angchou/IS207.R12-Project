import { getCartSubtotal, getItemTotal } from "./cart.js";

// Dữ liệu mẫu theo PAYMENT_METHOD. ID này chỉ dùng cho bản demo.
export const DEMO_PAYMENT_METHOD = {
  payment_id: 1,
  payment_name: "Demo payment",
};

// Các ô nhập lấy tên từ SHIPPING_INFO và ghi chú từ ORDER.
export function createDemoOrder(cart, shipping, accountId, orderId) {
  if (cart.length === 0) {
    throw new Error("Add a meal to your cart before checking out.");
  }

  const receiverName = shipping.receiver_name.trim();
  const phoneNumber = shipping.phone_number.trim();
  const address = shipping.address.trim();
  const district = shipping.district.trim();
  const city = shipping.city.trim();
  const note = shipping.customer_note.trim();

  if ([receiverName, address, district, city].some((value) => !value || value.length > 255)) {
    throw new Error("Fill in the recipient name, street address, district and city.");
  }
  if (!/^[0-9]{10}$/.test(phoneNumber)) {
    throw new Error("Enter a phone number with exactly 10 digits.");
  }
  if (note.length > 255) {
    throw new Error("Keep the order note within 255 characters.");
  }

  // Tạo bản xem lại theo ORDER. Mã được cấp bởi kho đơn demo.
  return {
    order_id: orderId,
    account_id: accountId,
    delivery_id: null,
    payment_id: DEMO_PAYMENT_METHOD.payment_id,
    receiver_name: receiverName,
    phone_number: phoneNumber,
    full_address: [address, district, city].join(", "),
    customer_note: note || null,
    total: getCartSubtotal(cart),
    used_point: 0,
    earned_point: 0,
    // Giữ ID size/combo, giá và addon đã chọn để xem lại theo ORDER_DETAIL.
    details: cart.map((item, index) => ({
      ...item,
      order_detail_id: index + 1,
      order_id: orderId,
      total: getItemTotal(item),
    })),
  };
}

// Các mã demo đại diện cho bảng STATUS; giao diện dùng tên để đối chiếu.
export const ORDER_STATUS = {
  PENDING: { status_id: 1, status_name: "PENDING", label: "Pending" },
  PREPARING: { status_id: 2, status_name: "PREPARING", label: "Preparing" },
  DELIVERING: { status_id: 3, status_name: "DELIVERING", label: "Out for delivery" },
  DELIVERED: { status_id: 4, status_name: "DELIVERED", label: "Delivered" },
  CANCELLED: { status_id: 5, status_name: "CANCELLED", label: "Cancelled" },
};

export const DELIVERY_STEPS = [
  { status: ORDER_STATUS.PENDING, title: "Order placed" },
  { status: ORDER_STATUS.PREPARING, title: "Preparing" },
  { status: ORDER_STATUS.DELIVERING, title: "Out for delivery" },
  { status: ORDER_STATUS.DELIVERED, title: "Delivered" },
];

// Mỗi lần đổi trạng thái, ghi thêm một mốc theo ORDER_STATUS.
export function createStatusEvent(orderId, status, createdAt = new Date().toISOString()) {
  return {
    order_id: orderId,
    status_id: status.status_id,
    status_name: status.status_name,
    created_at: createdAt,
  };
}

export function getLatestStatus(order) {
  // Các mốc được lưu theo thứ tự phát sinh; lấy mốc cuối để xét điều kiện hủy.
  return order.status_history.at(-1)?.status_name;
}

export function belongsToAccount(order, accountId) {
  return String(order.account_id) === String(accountId);
}

const orderDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatOrderDate(isoDate) {
  return orderDateFormatter.format(new Date(isoDate));
}

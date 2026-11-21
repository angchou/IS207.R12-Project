import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDemoOrder } from "../utils/demoCheckout.js";
import {
  belongsToAccount,
  createStatusEvent,
  getLatestStatus,
  ORDER_STATUS,
} from "../utils/orderHistory.js";

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      nextOrderId: 100001,

      // Checkout lưu đơn PENDING trước khi xóa giỏ. Thông tin liên hệ chỉ
      // hiển thị trên biên nhận; lịch sử lưu phần cần thiết để xem lại đơn.
      placeDemoOrder: (cart, shipping, accountId) => {
        const { orders, nextOrderId } = get();
        const receipt = createDemoOrder(cart, shipping, accountId, nextOrderId);
        const order = {
          order_id: receipt.order_id,
          account_id: receipt.account_id,
          delivery_id: receipt.delivery_id,
          payment_id: receipt.payment_id,
          total: receipt.total,
          details: receipt.details,
          cancel_reason: null,
          status_history: [createStatusEvent(receipt.order_id, ORDER_STATUS.PENDING)],
        };

        set({ orders: [order, ...orders], nextOrderId: nextOrderId + 1 });
        return receipt;
      },

      // Kiểm tra lại chủ đơn và trạng thái mới nhất ngay khi xác nhận hủy.
      cancelOrder: (orderId, accountId, reason) => {
        const { orders } = get();
        const order = orders.find((item) => item.order_id === orderId);
        if (
          !order ||
          !belongsToAccount(order, accountId) ||
          getLatestStatus(order) !== ORDER_STATUS.PENDING.status_name
        ) {
          return false;
        }

        const cancelledOrder = {
          ...order,
          cancel_reason: reason.trim().slice(0, 255) || null,
          status_history: [
            ...order.status_history,
            createStatusEvent(orderId, ORDER_STATUS.CANCELLED),
          ],
        };

        set({ orders: orders.map((item) => item === order ? cancelledOrder : item) });
        return true;
      },
    }),
    {
      // Lịch sử demo còn sau khi tải lại trên cùng trình duyệt.
      name: "food-demo-orders",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        nextOrderId: state.nextOrderId,
      }),
    },
  ),
);

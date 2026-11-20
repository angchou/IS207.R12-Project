import { MOCK_ACCOUNT, MOCK_COMBOS } from "./mockData.js";
import { DEMO_PAYMENT_METHOD } from "../utils/demoCheckout.js";
import { createStatusEvent, ORDER_STATUS } from "../utils/orderHistory.js";

// Ví dụ cố định để xem tiến trình dù chưa có backend hoặc shipper chạy thật.
const combo = MOCK_COMBOS[0];
const orderId = 2401;

export const MOCK_DELIVERING_ORDER = {
  order_id: orderId,
  account_id: MOCK_ACCOUNT.account_id,
  delivery_id: 201,
  payment_id: DEMO_PAYMENT_METHOD.payment_id,
  total: combo.price,
  is_sample: true,
  details: [
    {
      order_id: orderId,
      order_detail_id: 1,
      type: "combo",
      combo_id: combo.combo_id,
      product_size_id: null,
      name: combo.combo_name,
      image: combo.image,
      size_name: "Standard Combo Box",
      quantity: 1,
      unit_price: combo.price,
      total: combo.price,
      addons: [],
    },
  ],
  status_history: [
    createStatusEvent(orderId, ORDER_STATUS.PENDING, "2026-11-19T11:30:00+07:00"),
    createStatusEvent(orderId, ORDER_STATUS.PREPARING, "2026-11-19T11:35:00+07:00"),
    createStatusEvent(orderId, ORDER_STATUS.DELIVERING, "2026-11-19T11:48:00+07:00"),
  ],
};

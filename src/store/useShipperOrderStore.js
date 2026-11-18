import { create } from "zustand";
import {
  MOCK_ORDERS,
  MOCK_ORDER_STATUSES,
  MOCK_STATUSES,
  MOCK_SHIPPERS,
  hydrateOrderData,
} from "../data/mockData";

const STORAGE_KEY_ORDERS = "shipper_demo_orders_v6";
const STORAGE_KEY_STATUSES = "shipper_demo_order_statuses_v6";

// Dedicated logged-in shipper account from Table ACCOUNT (role_id: 3)
const LOGGED_IN_SHIPPER = MOCK_SHIPPERS[0];

function loadInitialOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to mockData
  }
  return MOCK_ORDERS;
}

function loadInitialOrderStatuses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATUSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Fallback to mockData
  }
  return MOCK_ORDER_STATUSES;
}

function formatCurrentTimestamp() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export const useShipperOrderStore = create((set, get) => ({
  rawOrders: loadInitialOrders(),
  orderStatuses: loadInitialOrderStatuses(),
  currentShipperId: LOGGED_IN_SHIPPER.account_id,

  // Get the logged-in shipper's ACCOUNT row
  getCurrentShipper: () => LOGGED_IN_SHIPPER,

  // Hydrate all orders with relational tables from database.txt
  getHydratedOrders: () => {
    const { rawOrders, orderStatuses } = get();
    return rawOrders.map((order) => hydrateOrderData(order, orderStatuses));
  },

  // Get available PENDING pool
  getPendingOrders: () => {
    return get()
      .getHydratedOrders()
      .filter((order) => order.current_status === "PENDING");
  },

  // Get accepted orders belonging to this shipper (ORDER.delivery_id === currentShipperId)
  getShipperOrders: () => {
    const { currentShipperId } = get();
    return get()
      .getHydratedOrders()
      .filter(
        (order) =>
          order.current_status !== "PENDING" &&
          order.delivery_id === Number(currentShipperId)
      );
  },

  // Accept order: Assign ORDER.delivery_id = currentShipperId and transition PENDING -> ACCEPTED
  acceptOrder: (orderId) => {
    const { rawOrders, orderStatuses, currentShipperId } = get();
    const acceptedStatus = MOCK_STATUSES.find(
      (s) => s.status_name === "ACCEPTED"
    );
    if (!acceptedStatus) return;

    const nextId =
      orderStatuses.reduce(
        (max, item) => Math.max(max, item.order_status_id),
        0
      ) + 1;

    const newStatusRecord = {
      order_status_id: nextId,
      order_id: Number(orderId),
      status_id: acceptedStatus.status_id,
      created_at: formatCurrentTimestamp(),
    };

    const updatedOrders = rawOrders.map((order) =>
      order.order_id === Number(orderId)
        ? { ...order, delivery_id: Number(currentShipperId) }
        : order
    );

    const updatedStatuses = [...orderStatuses, newStatusRecord];
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
    localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(updatedStatuses));

    set({
      rawOrders: updatedOrders,
      orderStatuses: updatedStatuses,
    });
  },

  // Update order status on the Order Detail screen (locked if COMPLETED or CANCELLED)
  updateOrderStatus: (orderId, targetStatusName, cancelReason = null) => {
    const { rawOrders, orderStatuses } = get();

    // Prevent status changes if the order is already COMPLETED or CANCELLED
    const currentOrderHydrated = get()
      .getHydratedOrders()
      .find((o) => o.order_id === Number(orderId));
    if (
      !currentOrderHydrated ||
      currentOrderHydrated.current_status === "COMPLETED" ||
      currentOrderHydrated.current_status === "CANCELLED"
    ) {
      return;
    }

    const targetStatus = MOCK_STATUSES.find(
      (s) => s.status_name === targetStatusName
    );
    if (!targetStatus) return;

    const nextId =
      orderStatuses.reduce(
        (max, item) => Math.max(max, item.order_status_id),
        0
      ) + 1;

    const newStatusRecord = {
      order_status_id: nextId,
      order_id: Number(orderId),
      status_id: targetStatus.status_id,
      created_at: formatCurrentTimestamp(),
    };

    const updatedStatuses = [...orderStatuses, newStatusRecord];

    const updatedOrders = rawOrders.map((order) => {
      if (order.order_id === Number(orderId)) {
        return {
          ...order,
          cancel_reason:
            targetStatusName === "CANCELLED"
              ? cancelReason ?? order.cancel_reason
              : order.cancel_reason,
        };
      }
      return order;
    });

    localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(updatedStatuses));
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));

    set({
      rawOrders: updatedOrders,
      orderStatuses: updatedStatuses,
    });
  },

  // Rate a completed order (1-5 stars, only allowed once when rating === 0)
  rateOrder: (orderId, ratingValue) => {
    const score = Number(ratingValue);
    if (score < 1 || score > 5) return;

    const { rawOrders } = get();
    const targetOrder = get()
      .getHydratedOrders()
      .find((o) => o.order_id === Number(orderId));

    if (
      !targetOrder ||
      targetOrder.current_status !== "COMPLETED" ||
      targetOrder.rating > 0
    ) {
      return;
    }

    const updatedOrders = rawOrders.map((order) =>
      order.order_id === Number(orderId) ? { ...order, rating: score } : order
    );

    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));
    set({ rawOrders: updatedOrders });
  },

  // Restore initial demo mock data
  resetDemoOrders: () => {
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_STATUSES);
    set({
      rawOrders: MOCK_ORDERS,
      orderStatuses: MOCK_ORDER_STATUSES,
    });
  },
}));

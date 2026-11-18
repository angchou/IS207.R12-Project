import {
  Clock,
  CheckCircle2,
  Bike,
  PackageCheck,
  XCircle,
} from "lucide-react";

export const STATUS_META = {
  PENDING: {
    code: "PENDING",
    label: "PENDING",
    shortLabel: "Pending Pickup",
    description: "New order waiting for a delivery partner to accept",
    icon: Clock,
    badgeClass:
      "bg-[var(--bg-subtle)] text-[var(--status-warning)] border border-[var(--status-warning)]",
    dotClass: "bg-[var(--status-warning)]",
  },
  ACCEPTED: {
    code: "ACCEPTED",
    label: "ACCEPTED",
    shortLabel: "Order Accepted",
    description: "Shipper accepted the order and is picking up at kitchen",
    icon: PackageCheck,
    badgeClass:
      "bg-[var(--bg-surface)] text-[var(--status-info)] border border-[var(--status-info)]",
    dotClass: "bg-[var(--status-info)]",
  },
  DELIVERING: {
    code: "DELIVERING",
    label: "DELIVERING",
    shortLabel: "Out for Delivery",
    description: "Shipper is on the way to the customer address",
    icon: Bike,
    badgeClass:
      "bg-[var(--bg-hero)] text-[var(--status-warning)] border border-[var(--btn-secondary-default)]",
    dotClass: "bg-[var(--btn-secondary-default)]",
  },
  COMPLETED: {
    code: "COMPLETED",
    label: "COMPLETED",
    shortLabel: "Delivered",
    description: "Order has been successfully delivered to the customer",
    icon: CheckCircle2,
    badgeClass:
      "bg-[var(--bg-surface)] text-[var(--status-success)] border border-[var(--status-success)]",
    dotClass: "bg-[var(--status-success)]",
  },
  CANCELLED: {
    code: "CANCELLED",
    label: "CANCELLED",
    shortLabel: "Cancelled",
    description: "Order was cancelled or delivery could not be completed",
    icon: XCircle,
    badgeClass:
      "bg-[var(--bg-badge-discount)] text-[var(--status-error)] border border-[var(--status-error)]",
    dotClass: "bg-[var(--status-error)]",
  },
};

export const DELIVERY_STEPS = [
  "PENDING",
  "ACCEPTED",
  "DELIVERING",
  "COMPLETED",
];

export const UPDATABLE_STATUSES = [
  "ACCEPTED",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];

export const PRESET_CANCEL_REASONS = [
  "Customer unreachable after 3 phone calls at delivery location",
  "Customer requested to cancel order when contacted",
  "Incorrect delivery address, unable to reach destination",
];

export function getSuggestedNextStatus(currentStatus) {
  if (currentStatus === "ACCEPTED") return "DELIVERING";
  if (currentStatus === "DELIVERING") return "COMPLETED";
  return currentStatus || "ACCEPTED";
}

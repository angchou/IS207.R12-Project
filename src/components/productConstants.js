import {
  Flame,
  Sparkles,
  Star,
  CircleCheck,
  PackageX,
  EyeOff,
} from "lucide-react";

// Trạng thái bán của món (cột PRODUCT.status)
export const PRODUCT_STATUS = {
  AVAILABLE: "AVAILABLE", // Có thể chọn: khách thấy và đặt được
  SOLD_OUT: "SOLD_OUT", // Hết hàng: khách vẫn thấy nhưng không đặt được
  UNAVAILABLE: "UNAVAILABLE", // Ngừng bán: chỉ Admin thấy, ẩn hoàn toàn với khách
};

// Cấu hình hiển thị cho từng trạng thái (nhãn, mô tả, icon, màu lấy từ global.css)
export const PRODUCT_STATUS_OPTIONS = [
  {
    value: PRODUCT_STATUS.AVAILABLE,
    label: "Available",
    description: "Customers can see and order",
    icon: CircleCheck,
    pillClasses:
      "bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/40",
    activeClasses:
      "bg-[var(--status-success)] text-[var(--text-inverse)] border-[var(--status-success)]",
  },
  {
    value: PRODUCT_STATUS.SOLD_OUT,
    label: "Sold Out",
    description: "Visible to customers, cannot order",
    icon: PackageX,
    pillClasses:
      "bg-[var(--status-warning)]/10 text-[var(--status-warning)] border-[var(--status-warning)]/40",
    activeClasses:
      "bg-[var(--status-warning)] text-[var(--text-inverse)] border-[var(--status-warning)]",
  },
  {
    value: PRODUCT_STATUS.UNAVAILABLE,
    label: "Unavailable",
    description: "Hidden from customers (admin only)",
    icon: EyeOff,
    pillClasses:
      "bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-divider)]",
    activeClasses:
      "bg-[var(--text-muted)] text-[var(--text-inverse)] border-[var(--text-muted)]",
  },
];

// Lấy cấu hình trạng thái theo giá trị, mặc định là AVAILABLE
export function getProductStatusMeta(status) {
  return (
    PRODUCT_STATUS_OPTIONS.find((o) => o.value === status) ||
    PRODUCT_STATUS_OPTIONS[0]
  );
}

// Món có hiển thị cho khách không (mọi trạng thái trừ UNAVAILABLE)
export function isVisibleToCustomer(product) {
  return product.status !== PRODUCT_STATUS.UNAVAILABLE;
}

// Nhãn phân loại món (cột PRODUCT.tag), màu lấy từ nhóm "Nhãn phân loại món ăn" trong global.css
export const PRODUCT_TAGS = [
  {
    value: "hot",
    label: "Hot Deal",
    icon: Star,
    classes:
      "bg-[var(--tag-hot)]/15 text-[var(--tag-hot)] border-[var(--tag-hot)]/40",
    activeClasses:
      "bg-[var(--tag-hot)] text-[var(--text-inverse)] border-[var(--tag-hot)]",
  },
  {
    value: "spicy",
    label: "Spicy",
    icon: Flame,
    classes:
      "bg-[var(--tag-spicy)]/15 text-[var(--tag-spicy)] border-[var(--tag-spicy)]/40",
    activeClasses:
      "bg-[var(--tag-spicy)] text-[var(--text-inverse)] border-[var(--tag-spicy)]",
  },
  {
    value: "veggie",
    label: "Veggie",
    icon: Sparkles,
    classes:
      "bg-[var(--tag-veggie)]/15 text-[var(--tag-veggie)] border-[var(--tag-veggie)]/40",
    activeClasses:
      "bg-[var(--tag-veggie)] text-[var(--text-inverse)] border-[var(--tag-veggie)]",
  },
];

// Lấy cấu hình tag theo giá trị, mặc định là "hot" (giống ProductCard phía Customer)
export function getProductTagMeta(tag) {
  return PRODUCT_TAGS.find((t) => t.value === tag) || PRODUCT_TAGS[0];
}

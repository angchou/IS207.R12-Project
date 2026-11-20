import { Tag } from "lucide-react";

// Bảng màu badge xoay vòng theo vị trí category (viết đủ chuỗi class để Tailwind sinh được CSS)
const CATEGORY_BADGE_CLASSES = [
  "bg-[var(--btn-secondary-default)]/15 text-[var(--status-warning)] border-[var(--btn-secondary-default)]/40",
  "bg-[var(--bg-badge-discount)] text-[var(--text-badge-discount)] border-[var(--border-active)]/30",
  "bg-[var(--btn-accent-default)]/15 text-[var(--btn-accent-default)] border-[var(--btn-accent-default)]/30",
  "bg-[var(--status-info)]/15 text-[var(--status-info)] border-[var(--status-info)]/30",
  "bg-[var(--tag-hot)]/15 text-[var(--tag-hot)] border-[var(--tag-hot)]/30",
];

// Badge cho mục chưa thuộc category nào (colorIndex < 0)
const UNCATEGORIZED_BADGE_CLASS =
  "bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-divider)]";

// Badge tên category (bo 50%) dùng chung cho các trang Admin (Add-on, Product...)
export default function CategoryBadge({ categoryName, colorIndex }) {
  const classes =
    colorIndex < 0
      ? UNCATEGORIZED_BADGE_CLASS
      : CATEGORY_BADGE_CLASSES[colorIndex % CATEGORY_BADGE_CLASSES.length];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${classes}`}
    >
      <Tag size={12} />
      {categoryName}
    </span>
  );
}

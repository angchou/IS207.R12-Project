// Công tắc mở bán / ngừng bán dùng chung cho bảng Món ăn và Combo (AVAILABLE <-> UNAVAILABLE)
export default function StatusToggle({ isOn, itemName, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={`${isOn ? "Stop selling" : "Start selling"} ${itemName}`}
      onClick={onToggle}
      className="inline-flex items-center gap-2 py-1.5 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      <span
        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
          isOn ? "bg-[var(--status-success)]" : "bg-[var(--border-divider)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[var(--bg-surface)] shadow-[var(--shadow-sm)] transition-transform ${
            isOn ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span
        className={`text-xs font-black uppercase whitespace-nowrap ${
          isOn ? "text-[var(--status-success)]" : "text-[var(--text-muted)]"
        }`}
      >
        {isOn ? "Available" : "Unavailable"}
      </span>
    </button>
  );
}

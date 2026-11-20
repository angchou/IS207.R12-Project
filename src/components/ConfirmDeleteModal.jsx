import { Link } from "react-router-dom";
import { Trash2, AlertTriangle, ArrowRight } from "lucide-react";

// Modal xác nhận xóa dùng chung cho các trang Admin (Add-on, Product, Combo...)
// Khi canConfirm = false: chỉ hiện cảnh báo (không cho xóa) kèm danh sách mục đang liên kết
export default function ConfirmDeleteModal({
  title = "Delete Item",
  message,
  confirmLabel = "Delete",
  canConfirm = true,
  items = [],
  itemsLabel,
  note,
  linkTo,
  linkLabel,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] w-full sm:max-w-md max-h-[90dvh] flex flex-col border-t-4 sm:border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="flex items-start gap-4">
            {/* Biểu tượng cảnh báo bo tròn 50% */}
            <div className="w-11 h-11 rounded-full bg-[var(--bg-badge-discount)] text-[var(--status-error)] border border-[var(--border-active)]/30 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black uppercase text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {message}
              </p>
            </div>
          </div>

          {/* Danh sách các mục đang liên kết (nếu có) */}
          {items.length > 0 && (
            <div className="border-2 border-[var(--border-light)] bg-[var(--bg-main)]">
              {itemsLabel && (
                <p className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-light)]">
                  {itemsLabel}
                </p>
              )}
              <ul className="max-h-48 overflow-y-auto divide-y divide-[var(--border-light)]">
                {items.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2.5 text-sm font-bold text-[var(--text-primary)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {note && (
            <p className="text-xs font-medium text-[var(--text-muted)]">
              {note}
            </p>
          )}
        </div>

        {/* Nút hành động dưới đáy Modal */}
        <div className="px-5 sm:px-6 py-4 border-t border-[var(--border-light)] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full text-xs font-bold uppercase text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {canConfirm ? "Cancel" : "Got it"}
          </button>

          {!canConfirm && linkTo && (
            <Link
              to={linkTo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-full text-xs font-black uppercase bg-[var(--bg-dark)] hover:bg-[var(--text-primary)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
            >
              {linkLabel} <ArrowRight size={15} />
            </Link>
          )}

          {canConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
            >
              <Trash2 size={15} /> {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

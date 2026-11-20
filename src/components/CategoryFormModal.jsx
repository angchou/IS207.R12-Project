import { useState } from "react";
import { X, FolderPlus, AlertCircle } from "lucide-react";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

const MAX_TEXT_LENGTH = 255;

// Modal thêm mới Category dùng chung (ADDON_CATEGORY, PRODUCT_CATEGORY...)
export default function CategoryFormModal({
  eyebrow = "Catalog",
  title = "Add New Category",
  placeholder = "e.g. New Category",
  existingNames,
  onClose,
  onSubmit,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  // Kiểm tra tên category hợp lệ và không trùng (category_name là unique)
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    if (trimmedName.length > MAX_TEXT_LENGTH) {
      setError(`Category name must be at most ${MAX_TEXT_LENGTH} characters.`);
      return;
    }

    const isDuplicateName = existingNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (isDuplicateName) {
      setError("This category already exists.");
      return;
    }

    onSubmit({ category_name: trimmedName });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-overlay)] backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[var(--bg-surface)] w-full sm:max-w-md max-h-[90dvh] flex flex-col border-t-4 sm:border-4 border-[var(--bg-dark)] shadow-[var(--shadow-lg)] overflow-hidden">
        {/* Header của Modal */}
        <div className="px-5 sm:px-6 py-4 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--btn-secondary-default)] block">
              {eyebrow}
            </span>
            <h3 className="text-lg font-black uppercase">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-surface)]/10 text-[var(--bg-hero)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 bg-[var(--bg-badge-discount)] border border-[var(--border-active)]/30 text-[var(--text-badge-discount)] text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Tên category (duy nhất) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Category Name{" "}
                <span className="text-[var(--status-error)]">*</span>
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  if (error) setError("");
                }}
                maxLength={MAX_TEXT_LENGTH}
                placeholder={placeholder}
                autoFocus
                className={`${INPUT_CLASS} font-semibold`}
              />
            </div>

            {/* Danh sách category hiện có để tham khảo */}
            {existingNames.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Existing categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {existingNames.map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-divider)]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nút hành động dưới đáy Modal */}
          <div className="px-5 sm:px-6 py-4 border-t border-[var(--border-light)] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full text-xs font-bold uppercase text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-colors cursor-pointer"
            >
              <FolderPlus size={15} /> Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

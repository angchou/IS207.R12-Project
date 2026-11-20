import { useState } from "react";
import { ImageOff, Upload, Link2 } from "lucide-react";

const INPUT_CLASS =
  "w-full pl-10 pr-3.5 py-2.5 border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

// Ảnh thu nhỏ dùng chung trong các bảng Admin, tự chuyển sang ô placeholder khi không có ảnh hoặc ảnh lỗi
export function ImageThumbnail({ src, alt, sizeClass = "w-12 h-12" }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`${sizeClass} shrink-0 bg-[var(--bg-hero)] border border-[var(--border-divider)] text-[var(--text-muted)] flex items-center justify-center`}
      >
        <ImageOff size={18} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`${sizeClass} shrink-0 object-cover border border-[var(--border-divider)] bg-[var(--bg-subtle)]`}
    />
  );
}

// Ô nhập ảnh: dán URL hoặc tải ảnh từ máy (đọc thành Base64 để xem trước ngay), kèm ảnh xem trước
export default function ImageInputField({ value, onChange, previewAlt }) {
  const isUploaded = value.startsWith("data:");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-start gap-3">
      <ImageThumbnail
        key={value}
        src={value}
        alt={previewAlt}
        sizeClass="w-16 h-16"
      />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="relative">
          <Link2
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={isUploaded ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              isUploaded
                ? "Using uploaded image"
                : "https://images.unsplash.com/..."
            }
            className={INPUT_CLASS}
          />
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-colors cursor-pointer">
          <Upload size={14} /> Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

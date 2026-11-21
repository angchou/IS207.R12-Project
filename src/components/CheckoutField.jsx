// Dùng chung nhãn, dấu bắt buộc và kiểu hiển thị cho các ô giao hàng.
export default function CheckoutField({ label, name, multiline = false, ...attributes }) {
  const Field = multiline ? "textarea" : "input";
  const id = `checkout-${name}`;

  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-[var(--text-primary)]">
        {label}
        {attributes.required && (
          <span aria-hidden="true" className="ml-1 text-[var(--status-error)]">*</span>
        )}
      </label>
      <Field
        {...attributes}
        id={id}
        name={name}
        className="block w-full border-2 border-[var(--border-light)] bg-[var(--bg-main)] px-3.5 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
      />
    </div>
  );
}

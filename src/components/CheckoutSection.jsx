// Khung dùng chung cho thông tin giao hàng, phương thức và tóm tắt đơn.
export default function CheckoutSection({ title, icon: Icon, children }) {
  return (
    <section className="min-w-0 border-2 border-[var(--border-light)] bg-[var(--bg-surface)] shadow-[var(--shadow-sm)]">
      <h2 className="flex items-center gap-2 border-b border-[var(--border-divider)] bg-[var(--bg-subtle)] px-5 py-4 text-base font-black uppercase tracking-tight sm:px-6">
        <Icon size={20} aria-hidden="true" className="shrink-0 text-[var(--btn-primary-default)]" />
        {title}
      </h2>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

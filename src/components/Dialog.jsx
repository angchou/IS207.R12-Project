import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Khi mở popup sửa món trên giỏ trượt, chỉ cửa sổ trên cùng nhận phím.
const openPanels = [];
let previousBodyOverflow;

// Khung dùng chung cho cửa sổ chọn món và giỏ trượt: nền mờ, Escape và bàn phím.
export default function Dialog({ children, onClose, labelledBy, side = false }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Cập nhật callback mà không đặt lại focus mỗi lần khách chọn size/addon.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    const previousFocus = document.activeElement;
    const previousPanel = openPanels.at(-1);
    if (previousPanel) {
      previousPanel.inert = true;
    } else {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openPanels.push(panel);

    // Đưa con trỏ vào cửa sổ và giữ Tab bên trong khi cửa sổ đang mở.
    const getFocusableElements = () =>
      Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]',
        ),
      ).filter((element) => element.getClientRects().length > 0);

    (getFocusableElements()[0] || panel).focus();

    const handleKeyDown = (event) => {
      if (openPanels.at(-1) !== panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        panel.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel.contains(document.activeElement) ||
          document.activeElement === panel)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel.contains(document.activeElement) ||
          document.activeElement === panel)
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const wasTopPanel = openPanels.at(-1) === panel;
      openPanels.splice(openPanels.indexOf(panel), 1);

      // Đóng popup trên cùng thì giỏ trượt bên dưới hoạt động lại.
      const nextPanel = openPanels.at(-1);
      if (nextPanel) {
        nextPanel.inert = false;
      } else {
        document.body.style.overflow = previousBodyOverflow;
      }
      if (wasTopPanel && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const content = (
    <div
      className={`fixed inset-0 z-100 flex ${
        side ? "justify-end" : "items-center justify-center p-4"
      }`}
    >
      {/* Bấm vùng nền để đóng; màu nền mờ lấy trực tiếp từ global.css. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-xs"
        onClick={onClose}
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative flex flex-col bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] outline-none ${
          side
            ? "h-dvh w-full max-w-md border-l-4 border-[var(--bg-dark)]"
            : "max-h-[90dvh] w-full max-w-lg overflow-hidden border-4 border-[var(--bg-dark)]"
        }`}
      >
        {children}
      </section>
    </div>
  );

  // Đặt các popup cạnh nhau ở cuối trang để lớp nền và bàn phím không chồng lẫn.
  return typeof document === "undefined" ? content : createPortal(content, document.body);
}

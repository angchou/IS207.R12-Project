import React from "react";
import { Sparkles } from "lucide-react";

export default function TopHeader() {
  return (
    <header
      style={{ backgroundColor: "var(--bg-dark, #230b0b)" }}
      className="sticky top-0 z-40 text-white shadow-md"
    >
      <div
        style={{ backgroundColor: "#a50b23" }}
        className="py-1 px-4 text-center text-xs font-semibold tracking-wider text-amber-100 flex items-center justify-center gap-2"
      >
        <Sparkles size={14} className="animate-pulse text-amber-300" />
        FREE DELIVERY ON ORDERS OVER $25.00 • EARN 10 REWARD POINTS PER $1 SPENT
      </div>
    </header>
  );
}

import React from "react";
import { Flame, ChevronRight, Clock, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-[var(--bg-hero)] border-b border-[var(--border-light)] py-10 lg:py-16 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Nội dung bên trái */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex mt-4 items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--btn-primary-default)]/30 px-3 py-1 rounded-full text-xs font-bold text-[var(--btn-primary-default)]">
              <Flame size={14} /> CRAVING REAL FAST FOOD?
            </div>

            <h1 className="text-[var(--text-primary)] text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              Hot, Sizzling <br />
              <span className="text-[var(--btn-primary-default)]">
                Juicy Burgers
              </span>{" "}
              & Wings
            </h1>

            <p className="text-[var(--text-secondary)] text-base sm:text-lg font-medium max-w-xl">
              Fresh Angus beef patties smashed to perfection, crispy buttermilk
              fried chicken, and stone-baked pizza delivered piping hot to your
              doorstep.
            </p>

            {/* Nút bấm */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#menu-section"
                className="bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse,#ffffff)] px-8 py-4 font-black text-base uppercase tracking-wider transition-all shadow-[var(--shadow-md)] inline-flex items-center gap-2 rounded-full"
              >
                Order Online Now <ChevronRight size={18} />
              </a>

              <a
                href="#hot-combos"
                className="bg-[var(--btn-secondary-default)] hover:bg-[var(--btn-secondary-hover)] active:bg-[var(--btn-secondary-active)] text-[var(--text-inverse,#ffffff)] px-6 py-4 font-bold text-base uppercase tracking-wider transition-all shadow-[var(--shadow-sm)] inline-flex items-center gap-2 rounded-full"
              >
                View Deals & Combos
              </a>
            </div>

            {/* Thông tin phụ */}
            <div className="pt-4 flex items-center gap-6 text-xs font-bold text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Clock
                  size={16}
                  className="text-[var(--btn-primary-default)]"
                />{" "}
                25 Min Fast Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  size={16}
                  className="text-[var(--color-success,#2e7d32)]"
                />{" "}
                100% Fresh Ingredients
              </div>
            </div>
          </div>

          {/* Khối hình ảnh bên phải */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 border-4 border-[var(--bg-surface,#ffffff)] shadow-[var(--shadow-lg)] bg-[var(--bg-surface,#ffffff)] p-2">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                alt="Juicy Firecracker Burger"
                className="w-full h-[340px] sm:h-[400px] object-cover"
              />

              <div className="bg-[var(--text-primary)] text-[var(--text-inverse,#ffffff)] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[var(--btn-secondary-default)] text-xs font-bold block uppercase tracking-widest">
                    Featured Today
                  </span>
                  <span className="font-black text-lg text-[var(--text-inverse,#ffffff)]">
                    Firecracker Jalapeño Smash
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--border-light)] line-through block">
                    $12.99
                  </span>
                  <span className="text-2xl font-black text-[var(--btn-secondary-default)]">
                    $8.99
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

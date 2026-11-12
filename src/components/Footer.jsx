import React from "react";
import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-[var(--text-inverse,#ffffff)] border-t-4 border-[var(--btn-primary-default)] pt-12 pb-8 bg-[var(--bg-inverse,#230b0b)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-2 cursor-pointer group mb-2">
            <div className="p-2 bg-[var(--bg-subtle)] rounded-full group-hover:bg-[var(--bg-main)] transition-colors">
              <Flame size={28} className="text-[var(--btn-primary-default)]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-[var(--text-inverse,#ffffff)]">
              Ditme
              <span className="text-[var(--btn-primary-default)]">UIT</span>
            </span>
          </div>
          <p className="text-xs text-[var(--text-inverse)] opacity-80 leading-relaxed mb-4">
            Serving hot, crispy, and mouthwatering fast food crafted from 100%
            fresh ingredients every day.
          </p>
        </div>

        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-[var(--btn-secondary-default)] mb-3">
            Fast Navigation
          </h4>
          <ul className="space-y-2 text-xs text-[var(--text-secondary)] opacity-90 font-medium">
            <li className="hover:text-[var(--text-inverse)] cursor-pointer transition-colors">
              Popular Combos
            </li>
            <li className="hover:text-[var(--text-inverse)] cursor-pointer transition-colors">
              Smash Burgers
            </li>
            <li className="hover:text-[var(--text-inverse)] cursor-pointer transition-colors">
              Crispy Chicken Bucket
            </li>
            <li className="hover:text-[var(--text-inverse)] cursor-pointer transition-colors">
              Loyalty Rewards
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-[var(--btn-secondary-default)] mb-3">
            Operating Hours
          </h4>
          <p className="text-xs text-[var(--text-inverse)] opacity-90 leading-relaxed">
            Mon - Sun: 08:00 AM - 11:30 PM <br />
            Late Night Delivery: Available until 01:00 AM
          </p>
        </div>

        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-[var(--btn-secondary-default)] mb-3">
            Customer Support
          </h4>
          <p className="text-xs text-[var(--text-secondary)] opacity-90 leading-relaxed mb-2">
            Hotline:{" "}
            <span className="font-bold text-[var(--text-inverse)]">
              1900-8888
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[var(--border-light)] text-center text-xs text-[var(--text-inverse)] opacity-60">
        © {new Date().getFullYear()} Fast Food Store. All rights reserved.
      </div>
    </footer>
  );
}

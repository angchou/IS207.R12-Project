import { Plus } from "lucide-react";

export default function ComboCard({ combo, onAddCombo }) {
  return (
    <div className="bg-[var(--bg-surface,#ffffff)] border-2 border-[var(--border-light)] hover:border-[var(--btn-primary-default)] transition-all flex flex-col justify-between shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">
      <div>
        <div className="relative h-48 overflow-hidden bg-[var(--bg-subtle)]">
          <img
            src={combo.image}
            alt={combo.combo_name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-[var(--btn-primary-default)] text-[var(--text-inverse,#ffffff)] text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[var(--shadow-sm)]">
              {combo.badge}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-black text-lg text-[var(--text-primary)] leading-snug mb-2">
            {combo.combo_name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mb-4 line-clamp-2">
            {combo.description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 border-t border-[var(--border-light)] mt-auto flex items-center justify-between pt-4">
        <div>
          <span className="text-xs text-[var(--text-secondary)] opacity-75 line-through block font-medium">
            ${combo.original_price.toFixed(2)}
          </span>
          <span className="text-2xl font-black text-[var(--btn-primary-default)]">
            ${combo.price.toFixed(2)}
          </span>
        </div>

        <div className="group">
          <button
            onClick={() => onAddCombo(combo)}
            className="bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse,#ffffff)] px-4 py-2.5 font-bold text-xs uppercase transition flex items-center gap-1.5 shadow-[var(--shadow-sm)] rounded-full cursor-pointer group-hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <Plus size={16} /> Add Combo
          </button>
        </div>
      </div>
    </div>
  );
}

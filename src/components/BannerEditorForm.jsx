import {
  Sparkles,
  Image as ImageIcon,
  Save,
  Utensils,
  Upload,
} from "lucide-react";

const INPUT_CLASS =
  "w-full px-3.5 py-2 border border-[var(--border-divider)] bg-[var(--bg-main)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]";

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function BannerEditorForm({
  draft,
  linkedProduct,
  onChange,
  onSizeChange,
  onImageUpload,
  onSave,
}) {
  return (
    <div className="lg:col-span-7 bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-md)] p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4">
        <div>
          <h3 className="text-xl font-black uppercase text-[var(--text-primary)]">
            1. Customize Banner Content
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Edit the headline, description, featured dish details, pricing and
            promotional bar.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
          Campaign #{draft.banner_id}
        </span>
      </div>

      {/* Campaign Title & Availability */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <FormField label="Campaign Title">
            <input
              type="text"
              value={draft.banner_title}
              onChange={(e) => onChange("banner_title", e.target.value)}
              className={`${INPUT_CLASS} font-bold`}
            />
          </FormField>
        </div>
        <FormField label="Availability">
          <select
            value={draft.status}
            onChange={(e) => onChange("status", e.target.value)}
            className={`${INPUT_CLASS} font-bold`}
          >
            <option value="AVAILABLE">Available</option>
            <option value="SOLD_OUT">Sold Out</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </FormField>
      </div>

      {/* Serving Size Selector when a Menu Item is linked */}
      {draft.source_type === "PRODUCT" && linkedProduct && (
        <div className="p-4 bg-[var(--bg-subtle)] border border-[var(--border-divider)] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase text-[var(--btn-primary-default)] flex items-center gap-1.5">
              <Utensils size={14} /> Linked Item: {linkedProduct.product_name}
            </span>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Select Serving Size:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {linkedProduct.sizes.map((sz) => {
              const isCurrentSize =
                Number(draft.product_size_id) === sz.product_size_id;
              return (
                <button
                  key={sz.product_size_id}
                  type="button"
                  onClick={() => onSizeChange(sz.product_size_id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isCurrentSize
                      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                      : "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                  }`}
                >
                  {sz.size_name} — ${Number(sz.price).toFixed(2)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Left Column Headline Settings */}
      <div className="space-y-4 pt-2 border-t border-[var(--border-light)]">
        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--btn-primary-default)]">
          Hero Headline & Call to Action
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Top Tagline Badge">
            <input
              type="text"
              value={draft.hero_badge}
              onChange={(e) => onChange("hero_badge", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField label="Main Headline">
            <input
              type="text"
              value={draft.headline_main}
              onChange={(e) => onChange("headline_main", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Highlighted Text (Red)">
            <input
              type="text"
              value={draft.headline_highlight}
              onChange={(e) => onChange("headline_highlight", e.target.value)}
              className={`${INPUT_CLASS} font-bold text-[var(--btn-primary-default)]`}
            />
          </FormField>
          <FormField label="Headline Ending Text">
            <input
              type="text"
              value={draft.headline_sub}
              onChange={(e) => onChange("headline_sub", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <FormField label="Banner Description">
          <textarea
            rows={3}
            maxLength={255}
            value={draft.description}
            onChange={(e) => onChange("description", e.target.value)}
            className={INPUT_CLASS}
          />
          <div className="text-right text-[11px] text-[var(--text-muted)]">
            {draft.description?.length || 0}/255 characters
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Primary Button Label">
            <input
              type="text"
              value={draft.primary_cta_text}
              onChange={(e) => onChange("primary_cta_text", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField label="Secondary Button Label">
            <input
              type="text"
              value={draft.secondary_cta_text}
              onChange={(e) => onChange("secondary_cta_text", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>
      </div>

      {/* Right Featured Item Card Settings */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-light)]">
        <h4 className="text-xs font-black uppercase tracking-wider text-[var(--btn-primary-default)]">
          Featured Dish Card & Pricing
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Featured Item Name">
            <input
              type="text"
              value={draft.featured_name}
              onChange={(e) => onChange("featured_name", e.target.value)}
              className={`${INPUT_CLASS} font-bold`}
            />
          </FormField>
          <FormField label="Featured Subtitle Badge">
            <input
              type="text"
              value={draft.featured_badge}
              onChange={(e) => onChange("featured_badge", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Sale Price ($)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={draft.price}
              onChange={(e) => onChange("price", e.target.value)}
              className={`${INPUT_CLASS} font-black text-[var(--color-price)]`}
            />
          </FormField>
          <FormField label="Original Price ($)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={draft.original_price}
              onChange={(e) => onChange("original_price", e.target.value)}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField label="Flavor / Deal Tag">
            <select
              value={draft.tag}
              onChange={(e) => onChange("tag", e.target.value)}
              className={`${INPUT_CLASS} font-bold`}
            >
              <option value="spicy">Spicy (Chili Red)</option>
              <option value="hot">Hot Deal (Orange)</option>
              <option value="veggie">Fresh / Veggie (Green)</option>
            </select>
          </FormField>
        </div>

        {/* Banner Image URL & Upload */}
        <FormField label="Banner Image (URL or Local Upload)">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <ImageIcon
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={draft.image}
                onChange={(e) => onChange("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`${INPUT_CLASS} pl-10`}
              />
            </div>
            <label className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-hero)] text-[var(--btn-primary-default)] border border-[var(--border-divider)] text-xs font-bold uppercase cursor-pointer transition-colors shrink-0">
              <Upload size={15} /> Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </FormField>

        {/* Top Promotional Bar */}
        <div className="pt-3 border-t border-[var(--border-light)] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2">
              <Sparkles
                size={14}
                className="text-[var(--btn-secondary-default)]"
              />
              Top Promotional Announcement Bar
            </label>
            <input
              type="checkbox"
              checked={draft.top_promo_enabled}
              onChange={(e) => onChange("top_promo_enabled", e.target.checked)}
              className="w-4 h-4 accent-[var(--btn-primary-default)] cursor-pointer"
            />
          </div>
          {draft.top_promo_enabled && (
            <input
              type="text"
              value={draft.top_promo_text}
              onChange={(e) => onChange("top_promo_text", e.target.value)}
              className={`${INPUT_CLASS} text-xs font-semibold`}
            />
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-4 border-t-2 border-[var(--border-divider)] flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onSave(false)}
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase border-2 border-[var(--btn-primary-default)] text-[var(--btn-primary-default)] hover:bg-[var(--bg-badge-discount)] transition-all cursor-pointer"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => onSave(true)}
          className="px-6 py-2.5 rounded-full text-xs font-black uppercase bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-md)] transition-all cursor-pointer flex items-center gap-2"
        >
          <Save size={15} /> Save & Publish Banner
        </button>
      </div>
    </div>
  );
}

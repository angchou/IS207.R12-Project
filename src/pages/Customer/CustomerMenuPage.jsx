import React, { useState } from "react";
import { Search, SlidersHorizontal, Flame } from "lucide-react";
// Import tái sử dụng components
import ProductCard from "../../components/ProductCard";
import CustomizerModal from "../../components/CustomizerModal";
import CartDrawer from "../../components/CartDrawer";
// Import Mock Data
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../../data/mockData";

export default function CustomerMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // State Giỏ hàng & Modal
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderFulfilled, setOrderFulfilled] = useState(false);

  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [modalSelectedSize, setModalSelectedSize] = useState(null);
  const [modalSelectedAddons, setModalSelectedAddons] = useState([]);

  // Lọc sản phẩm
  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === 0 || prod.category_id === selectedCategory;
    const matchesSearch =
      prod.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openCustomizer = (product) => {
    setSelectedProductModal(product);
    setModalSelectedSize(product.sizes[0]);
    setModalSelectedAddons([]);
  };

  return (
    <div className="min-h-screen font-sans text-[var(--text-primary)] selection:bg-[var(--btn-primary-default)] selection:text-[var(--text-inverse,#ffffff)]">
      {/* Banner đầu trang */}
      <div className="bg-[var(--bg-inverse,#230b0b)] relative overflow-hidden py-12 lg:py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--btn-primary-default)] px-3 py-1 rounded-full text-xs font-bold text-[var(--text-inverse,#ffffff)] my-4">
            <Flame size={14} /> 100% FRESH INGREDIENTS
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-[var(--text-inverse,#ffffff)] uppercase tracking-tight mb-4">
            Our Full Menu
          </h1>
          <p className="text-[var(--btn-secondary-default)] max-w-2xl mx-auto text-sm md:text-base font-medium">
            From sizzling smash burgers to extra crunchy hot wings. Everything
            is made to order and delivered piping hot.
          </p>
        </div>
      </div>

      {/* Main Menu Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-[100px] bg-[var(--bg-surface,#ffffff)] border-2 border-[var(--border-light)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="font-black text-lg uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--border-light)] pb-3 text-[var(--text-primary)]">
              <SlidersHorizontal
                size={18}
                className="text-[var(--btn-primary-default)]"
              />{" "}
              Categories
            </h3>

            <div className="space-y-1.5">
              {MOCK_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.category_id;
                return (
                  <button
                    key={cat.category_id}
                    onClick={() => setSelectedCategory(cat.category_id)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-bold uppercase transition-all ${
                      isActive
                        ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse,#ffffff)] shadow-[var(--shadow-md)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--btn-primary-default)]"
                    }`}
                  >
                    {cat.category_name}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
              {MOCK_CATEGORIES.find((c) => c.category_id === selectedCategory)
                ?.category_name || "All Menu"}
            </h2>

            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                type="text"
                placeholder="Search cravings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-surface,#ffffff)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm font-bold pl-10 pr-4 py-3 border-2 border-[var(--border-light)] rounded-full focus:outline-none focus:border-[var(--btn-primary-default)] shadow-[var(--shadow-sm)] transition-colors"
              />
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[var(--bg-surface,#ffffff)] border-2 border-dashed border-[var(--border-light)] rounded-xl">
              <p className="text-xl font-black text-[var(--text-secondary)] uppercase mb-2">
                No items found
              </p>
              <p className="text-sm text-[var(--text-secondary)] opacity-75">
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(0);
                  setSearchQuery("");
                }}
                className="mt-6 px-6 py-2.5 bg-[var(--bg-subtle)] text-[var(--btn-primary-default)] font-bold text-xs uppercase rounded-full hover:bg-[var(--bg-main)] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onCustomize={openCustomizer}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      {selectedProductModal && (
        <CustomizerModal
          product={selectedProductModal}
          selectedSize={modalSelectedSize}
          setSelectedSize={setModalSelectedSize}
          selectedAddons={modalSelectedAddons}
          setSelectedAddons={setModalSelectedAddons}
          onClose={() => setSelectedProductModal(null)}
          setCart={setCart}
          setIsCartOpen={setIsCartOpen}
        />
      )}

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          onClose={() => setIsCartOpen(false)}
          orderFulfilled={orderFulfilled}
          setOrderFulfilled={setOrderFulfilled}
        />
      )}
    </div>
  );
}

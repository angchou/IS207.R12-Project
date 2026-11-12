import { useState } from "react";
import { Tag } from "lucide-react";

import TopHeader from "../../components/TopHeader";
import ProductCard from "../../components/ProductCard";
import ComboCard from "../../components/ComboCard";
import CustomizerModal from "../../components/CustomizerModal";
import HeroSection from "../../components/HeroSection";
import CartDrawer from "../../components/CartDrawer";

import {
  MOCK_CATEGORIES,
  MOCK_COMBOS,
  MOCK_PRODUCTS,
} from "../../data/mockData";

export default function CustomerHomePage() {
  // State quản lý UI
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State quản lý dữ liệu giỏ hàng và đặt hàng
  const [cart, setCart] = useState([]);
  const [orderFulfilled, setOrderFulfilled] = useState(false);

  // State Modal tùy chỉnh món
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [modalSelectedSize, setModalSelectedSize] = useState(null);
  const [modalSelectedAddons, setModalSelectedAddons] = useState([]);

  // Lọc sản phẩm dựa trên Danh mục và Tìm kiếm
  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === 0 || prod.category_id === selectedCategory;
    const matchesSearch =
      prod.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Xử lý mở Modal
  const openCustomizer = (product) => {
    setSelectedProductModal(product);
    setModalSelectedSize(product.sizes[0]);
    setModalSelectedAddons([]);
  };

  // Thêm Combo nhanh vào giỏ
  const handleAddComboToCart = (combo) => {
    const newComboItem = {
      cart_id: Date.now(),
      type: "combo",
      combo_id: combo.combo_id,
      name: combo.combo_name,
      size_name: "Standard Combo Box",
      unit_price: combo.price,
      quantity: 1,
      addons: [],
    };
    setCart((prev) => [...prev, newComboItem]);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-sans selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)]">
      <TopHeader />
      <HeroSection />

      {/* Section Hot Combos */}
      <section
        id="hot-combos"
        className="py-12 bg-[var(--bg-subtle)] border-b border-[var(--border-divider)] w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-badge-discount)] uppercase tracking-wider mb-1">
                <Tag size={14} /> Value Meal Boxes
              </div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight uppercase">
                Hot Savings & Super Combos
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {MOCK_COMBOS.map((combo) => (
              <ComboCard
                key={combo.combo_id}
                combo={combo}
                onAddCombo={handleAddComboToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section Food Menu */}
      <section
        id="menu-section"
        className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            Explore Our Food Menu
          </h2>
          <div className="w-16 h-1 bg-[var(--btn-primary-default)] mx-auto mt-3"></div>
        </div>

        {/* Tab Danh mục */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {MOCK_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.category_id;
            return (
              <button
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`px-5 py-2.5 font-bold text-xs uppercase border-2 rounded-full transition-all ${
                  isActive
                    ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)] shadow-md"
                    : "bg-[var(--bg-surface,#ffffff)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                }`}
              >
                {cat.category_name}
              </button>
            );
          })}
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onCustomize={openCustomizer}
            />
          ))}
        </div>
      </section>

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

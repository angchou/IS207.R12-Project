import { useState, useMemo } from "react";
import {
  Save,
  CheckCircle2,
  Eye,
  Plus,
  Search,
  Layers,
  Utensils,
  Package,
  Sliders,
  AlertCircle,
} from "lucide-react";
import {
  MOCK_PRODUCTS,
  MOCK_COMBOS,
  MOCK_CATEGORIES,
} from "../../data/mockData";
import BannerPresetCard from "../../components/BannerPresetCard";
import BannerCatalogItem from "../../components/BannerCatalogItem";
import BannerEditorForm from "../../components/BannerEditorForm";
import BannerPreviewModal, {
  BannerLivePreview,
} from "../../components/BannerPreviewModal";

// Dữ liệu cấu hình Banner mẫu ban đầu (dùng khi localStorage chưa có dữ liệu)
const INITIAL_BANNERS = [
  {
    banner_id: 1,
    banner_title: "Spicy Angus Smash Burger Campaign",
    is_active: true,
    source_type: "PRODUCT",
    product_id: 1,
    product_size_id: 101,
    combo_id: null,
    hero_badge: "CRAVING REAL FAST FOOD?",
    headline_main: "Hot, Sizzling",
    headline_highlight: "Juicy Burgers",
    headline_sub: "& Wings",
    description:
      "Fresh Angus beef patties smashed to perfection, crispy buttermilk fried chicken, and stone-baked pizza delivered piping hot to your doorstep.",
    primary_cta_text: "Order Online Now",
    primary_cta_link: "#menu-section",
    secondary_cta_text: "View Deals & Combos",
    secondary_cta_link: "#hot-combos",
    delivery_subtext: "25 Min Fast Delivery",
    quality_subtext: "100% Fresh Ingredients",
    featured_badge: "Featured Today",
    featured_name: "Firecracker Jalapeño Smash",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80",
    price: 8.99,
    original_price: 12.99,
    tag: "spicy",
    status: "AVAILABLE",
    review_count: 184,
    total_rating: 902,
    top_promo_enabled: true,
    top_promo_text:
      "FREE DELIVERY ON ORDERS OVER $25.00 • EARN 10 REWARD POINTS PER $1 SPENT",
    updated_at: "Nov 19, 2026 15:10",
  },
  {
    banner_id: 2,
    banner_title: "Weekend Party Crunch Box Deal",
    is_active: false,
    source_type: "COMBO",
    product_id: null,
    product_size_id: null,
    combo_id: 501,
    hero_badge: "LIMITED TIME SUPER DEAL",
    headline_main: "Crispy Golden",
    headline_highlight: "Party Combo",
    headline_sub: "Box",
    description:
      "2 Crispy Spicy Burgers + 4 Pcs Hot Wings + 1 XL Waffle Fries + 2 Cold Cokes. Share the ultimate crispy feast with your crew!",
    primary_cta_text: "Order Combo Now",
    primary_cta_link: "#hot-combos",
    secondary_cta_text: "Explore Full Menu",
    secondary_cta_link: "#menu-section",
    delivery_subtext: "Free Delivery Over $25",
    quality_subtext: "Hot & Fresh Guarantee",
    featured_badge: "BEST SELLER",
    featured_name: "Ultimate Crunch Party Box",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    price: 24.99,
    original_price: 32.0,
    tag: "hot",
    status: "AVAILABLE",
    review_count: 245,
    total_rating: 1200,
    top_promo_enabled: true,
    top_promo_text:
      "WEEKEND SPECIAL: SAVE 22% ON THE ULTIMATE CRUNCH PARTY BOX!",
    updated_at: "Nov 18, 2026 18:45",
  },
  {
    banner_id: 3,
    banner_title: "Artisan Pepperoni Pizza Feast",
    is_active: false,
    source_type: "COMBO",
    product_id: null,
    product_size_id: null,
    combo_id: 503,
    hero_badge: "ARTISAN STONE-BAKED",
    headline_main: "Cheesy Melted",
    headline_highlight: "Pepperoni Feast",
    headline_sub: "Pizza",
    description:
      '12" Pepperoni Passion Pizza + Cheesy Garlic Breadsticks + Dip Trio. Hand-tossed fresh dough baked golden with premium mozzarella.',
    primary_cta_text: "Grab Pizza Deal",
    primary_cta_link: "#hot-combos",
    secondary_cta_text: "Customize Size",
    secondary_cta_link: "#menu-section",
    delivery_subtext: "25 Min Fast Delivery",
    quality_subtext: "100% Premium Mozzarella",
    featured_badge: "FAMILY SIZE",
    featured_name: "Family Pepperoni Feast",
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    price: 22.0,
    original_price: 28.0,
    tag: "veggie",
    status: "AVAILABLE",
    review_count: 160,
    total_rating: 784,
    top_promo_enabled: true,
    top_promo_text:
      "ORDER ANY FAMILY PIZZA FEAST & GET FREE CHEESY GARLIC BREADSTICKS!",
    updated_at: "Nov 17, 2026 09:15",
  },
];

export default function AdminSettingPage() {
  // Danh sách các chiến dịch Banner (ưu tiên đọc từ localStorage nếu đã lưu trước đó)
  const [banners, setBanners] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_homepage_banners");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Nếu lỗi parse JSON thì dùng dữ liệu mặc định
    }
    return INITIAL_BANNERS;
  });

  // ID của Banner đang được chọn để chỉnh sửa
  const [selectedBannerId, setSelectedBannerId] = useState(() => {
    const active = banners.find((b) => b.is_active) || banners[0];
    return active.banner_id;
  });

  // Bản nháp (draft) đang chỉnh sửa trên form & hiển thị ở Live Preview
  const [draft, setDraft] = useState(
    () => banners.find((b) => b.banner_id === selectedBannerId) || banners[0],
  );

  // State bộ lọc danh sách Món ăn / Combo bên cột phải
  const [catalogTab, setCatalogTab] = useState("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [catalogSearch, setCatalogSearch] = useState("");

  // State thông báo nổi (Toast) và Modal xem trước toàn màn hình
  const [toastMessage, setToastMessage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Hiển thị thông báo ngắn ở góc dưới phải trong 3 giây
  const triggerToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lưu danh sách Banner và Banner đang kích hoạt vào localStorage để đồng bộ sang CustomerHomePage
  const persistBanners = (updatedList, activeBanner) => {
    try {
      localStorage.setItem(
        "admin_homepage_banners",
        JSON.stringify(updatedList),
      );
      if (activeBanner) {
        localStorage.setItem(
          "active_customer_hero_banner",
          JSON.stringify(activeBanner),
        );
      }
    } catch {
      // Bỏ qua nếu bộ nhớ trình duyệt bị đầy
    }
  };

  // Chọn một chiến dịch Banner để đưa vào form chỉnh sửa & Live Preview
  const handleSelectBanner = (banner) => {
    setSelectedBannerId(banner.banner_id);
    setDraft({ ...banner });
  };

  // Cập nhật từng trường dữ liệu của bản nháp khi Admin nhập liệu
  const handleDraftChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  // Nạp thông tin một Món ăn + Kích cỡ cụ thể vào thẻ Featured trên Banner
  const handleApplyProductToBanner = (product, sizeObj = null) => {
    const chosenSize = sizeObj || product.sizes?.[0] || {
      product_size_id: 0,
      size_name: "Standard",
      price: 9.99,
    };
    const basePrice = Number(chosenSize.price) || 9.99;

    setDraft((prev) => ({
      ...prev,
      source_type: "PRODUCT",
      product_id: product.product_id,
      product_size_id: chosenSize.product_size_id,
      combo_id: null,
      featured_badge: `SIZE: ${chosenSize.size_name.toUpperCase()}`,
      featured_name: product.product_name,
      description: product.description || prev.description,
      image: product.image || prev.image,
      price: basePrice,
      original_price: Number((basePrice * 1.35).toFixed(2)),
      tag: product.tag || "hot",
      status: product.status || "AVAILABLE",
      review_count: product.review_count || 0,
      total_rating: Math.round(
        (product.rating || 4.8) * (product.review_count || 100),
      ),
    }));

    triggerToast(
      `Loaded "${product.product_name}" (${chosenSize.size_name}) into the banner editor.`,
    );
  };

  // Nạp thông tin một gói Combo khuyến mãi vào thẻ Featured trên Banner
  const handleApplyComboToBanner = (combo) => {
    setDraft((prev) => ({
      ...prev,
      source_type: "COMBO",
      product_id: null,
      product_size_id: null,
      combo_id: combo.combo_id,
      featured_badge: combo.badge || "HOT COMBO",
      featured_name: combo.combo_name,
      description: combo.description || prev.description,
      image: combo.image || prev.image,
      price: Number(combo.price),
      original_price: Number(combo.original_price),
      tag: combo.tag || "hot",
      status: combo.status || "AVAILABLE",
      review_count: combo.review_count || 150,
      total_rating:
        combo.total_rating || Math.round(4.9 * (combo.review_count || 150)),
    }));

    triggerToast(`Loaded "${combo.combo_name}" into the banner editor.`);
  };

  // Đổi kích cỡ (Size) của món ăn đang liên kết với Banner và cập nhật lại giá
  const handleProductSizeChange = (productSizeId) => {
    const linkedProduct = MOCK_PRODUCTS.find(
      (p) => p.product_id === Number(draft.product_id),
    );
    const sizeObj = linkedProduct?.sizes.find(
      (s) => s.product_size_id === Number(productSizeId),
    );
    if (!sizeObj) return;

    const newPrice = Number(sizeObj.price);
    setDraft((prev) => ({
      ...prev,
      product_size_id: sizeObj.product_size_id,
      price: newPrice,
      original_price: Number((newPrice * 1.3).toFixed(2)),
      featured_badge: `SIZE: ${sizeObj.size_name.toUpperCase()}`,
    }));
  };

  // Đọc file ảnh tải lên từ máy Admin thành chuỗi Base64 để xem trước ngay
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleDraftChange("image", reader.result);
        triggerToast("Uploaded new banner image to preview.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Lưu bản nháp hiện tại; nếu setAsActive = true thì áp dụng ngay lên Trang chủ Customer
  const handleSaveBanner = (setAsActive = false) => {
    const nowStr = new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedDraft = {
      ...draft,
      is_active: setAsActive ? true : draft.is_active,
      updated_at: nowStr,
    };

    const updatedBanners = banners.map((item) => {
      if (item.banner_id === draft.banner_id) return updatedDraft;
      return setAsActive ? { ...item, is_active: false } : item;
    });

    setBanners(updatedBanners);
    setDraft(updatedDraft);
    persistBanners(
      updatedBanners,
      updatedBanners.find((b) => b.is_active) || updatedDraft,
    );

    triggerToast(
      setAsActive
        ? `Saved and published "${draft.banner_title}" to the Customer Homepage!`
        : `Saved changes to "${draft.banner_title}".`,
    );
  };

  // Kích hoạt nhanh một chiến dịch Banner làm Banner chính trên Trang chủ & đồng bộ Preview
  const handleActivateBannerId = (bannerId) => {
    const updated = banners.map((b) => ({
      ...b,
      is_active: b.banner_id === bannerId,
    }));
    const activeObj = updated.find((b) => b.banner_id === bannerId);
    setBanners(updated);
    if (activeObj) {
      setSelectedBannerId(bannerId);
      setDraft({ ...activeObj });
    }
    persistBanners(updated, activeObj);
    triggerToast(`"${activeObj?.banner_title}" is now live on the Homepage!`);
  };

  // Tạo thêm một chiến dịch Banner mới từ mẫu mặc định
  const handleAddNewBanner = () => {
    const newId =
      banners.reduce((max, b) => Math.max(max, b.banner_id), 0) + 1;
    const newBanner = {
      ...INITIAL_BANNERS[0],
      banner_id: newId,
      banner_title: `New Banner Campaign #${newId}`,
      is_active: false,
      updated_at: "Just now",
    };
    const updated = [...banners, newBanner];
    setBanners(updated);
    setSelectedBannerId(newId);
    setDraft(newBanner);
    triggerToast(`Created "New Banner Campaign #${newId}".`);
  };

  // Xóa một chiến dịch Banner (luôn giữ lại tối thiểu 1 chiến dịch)
  const handleDeleteBanner = (bannerId) => {
    if (banners.length <= 1) {
      triggerToast("At least one banner campaign must remain.", "error");
      return;
    }
    const target = banners.find((b) => b.banner_id === bannerId);
    const remaining = banners.filter((b) => b.banner_id !== bannerId);
    if (target?.is_active && remaining.length > 0) {
      remaining[0].is_active = true;
    }
    setBanners(remaining);
    if (selectedBannerId === bannerId) {
      setSelectedBannerId(remaining[0].banner_id);
      setDraft({ ...remaining[0] });
    }
    persistBanners(
      remaining,
      remaining.find((b) => b.is_active),
    );
    triggerToast(`Deleted "${target?.banner_title}".`);
  };

  // Lọc danh sách Combo theo tab và từ khóa tìm kiếm
  const filteredCombos = useMemo(() => {
    if (catalogTab === "PRODUCT") return [];
    const q = catalogSearch.toLowerCase();
    return MOCK_COMBOS.filter(
      (c) =>
        c.combo_name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.badge.toLowerCase().includes(q),
    );
  }, [catalogTab, catalogSearch]);

  // Lọc danh sách Món ăn theo tab, danh mục và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    if (catalogTab === "COMBO") return [];
    const q = catalogSearch.toLowerCase();
    return MOCK_PRODUCTS.filter((p) => {
      const matchCat =
        selectedCategoryId === 0 || p.category_id === selectedCategoryId;
      const matchQuery =
        p.product_name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [catalogTab, selectedCategoryId, catalogSearch]);

  // Tìm thông tin đầy đủ của món ăn đang được gắn vào Banner (để hiển thị danh sách Size)
  const linkedProductObj = useMemo(
    () =>
      MOCK_PRODUCTS.find((p) => p.product_id === Number(draft.product_id)) ||
      null,
    [draft.product_id],
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)] pt-[72px]">
      {/* Thông báo Toast nổi ở góc dưới bên phải */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 shadow-[var(--shadow-lg)] border-2 border-[var(--border-light)] bg-[var(--bg-dark)] text-[var(--text-inverse)]">
          {toastMessage.type === "error" ? (
            <AlertCircle
              size={20}
              className="text-[var(--status-error)] shrink-0"
            />
          ) : (
            <CheckCircle2
              size={20}
              className="text-[var(--btn-secondary-default)] shrink-0"
            />
          )}
          <span className="text-sm font-bold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
        {/* 1. TIÊU ĐỀ TRANG & NÚT HÀNH ĐỘNG CHÍNH */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <Sliders size={14} /> Homepage Banner Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Customer Homepage Banner Settings
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
              Customize the Hero Banner content, Top Promotional Bar, and
              feature menu items or combo deals directly on the customer
              storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--btn-secondary-default)] hover:bg-[var(--btn-secondary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-all cursor-pointer"
            >
              <Eye size={16} /> Fullscreen Preview
            </button>

            <button
              type="button"
              onClick={() => handleSaveBanner(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] shadow-[var(--shadow-md)] transition-all cursor-pointer"
            >
              <Save size={16} /> Save & Apply to Homepage
            </button>
          </div>
        </div>

        {/* 2. DANH SÁCH CÁC CHIẾN DỊCH BANNER ĐÃ LƯU */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Layers size={20} className="text-[var(--btn-primary-default)]" />
              Banner Campaigns ({banners.length})
            </h2>
            <button
              type="button"
              onClick={handleAddNewBanner}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase bg-[var(--bg-surface)] text-[var(--btn-primary-default)] border-2 border-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-default)] hover:text-[var(--text-inverse)] transition-all cursor-pointer"
            >
              <Plus size={15} /> New Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((item) => (
              <BannerPresetCard
                key={item.banner_id}
                banner={item}
                isSelected={item.banner_id === selectedBannerId}
                onSelect={handleSelectBanner}
                onActivate={handleActivateBannerId}
                onDelete={handleDeleteBanner}
              />
            ))}
          </div>
        </div>

        {/* 3. KHUNG XEM TRƯỚC TRỰC TIẾP BANNER TRANG CHỦ */}
        <div className="border-2 border-[var(--border-divider)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] overflow-hidden">
          <div className="px-6 py-3.5 bg-[var(--bg-dark)] text-[var(--text-inverse)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[var(--btn-primary-default)] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--btn-secondary-default)] inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[var(--btn-accent-default)] inline-block"></span>
              <span className="text-xs font-bold uppercase tracking-wider ml-2 text-[var(--bg-hero)]">
                Live Preview — {draft.banner_title}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-surface)]/10 text-[var(--bg-hero)] text-xs font-semibold">
              {draft.is_active ? "Currently Live" : "Editing Draft"}
            </span>
          </div>

          <BannerLivePreview banner={draft} />
        </div>

        {/* 4. KHU VỰC CHỈNH SỬA NỘI DUNG (TRÁI) & CHỌN MÓN / COMBO (PHẢI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột trái: Form chỉnh sửa chi tiết Banner */}
          <BannerEditorForm
            draft={draft}
            linkedProduct={linkedProductObj}
            onChange={handleDraftChange}
            onSizeChange={handleProductSizeChange}
            onImageUpload={handleImageUpload}
            onSave={handleSaveBanner}
          />

          {/* Cột phải: Bộ chọn nhanh Món ăn / Combo đưa lên Banner */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-md)] p-6 space-y-5">
            <div>
              <h3 className="text-xl font-black uppercase text-[var(--text-primary)]">
                2. Feature Item from Menu
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Pick any combo deal or menu item size to automatically populate
                its photo, name, description, and pricing on the banner.
              </p>
            </div>

            {/* Tab lọc: Tất cả / Combo / Món lẻ */}
            <div className="flex items-center gap-2">
              {[
                { id: "ALL", label: "All Items", icon: <Layers size={14} /> },
                {
                  id: "COMBO",
                  label: `Combos (${MOCK_COMBOS.length})`,
                  icon: <Package size={14} />,
                },
                {
                  id: "PRODUCT",
                  label: `Menu (${MOCK_PRODUCTS.length})`,
                  icon: <Utensils size={14} />,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCatalogTab(t.id)}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-bold uppercase flex items-center justify-center gap-1.5 border-2 transition-all cursor-pointer ${
                    catalogTab === t.id
                      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                      : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Danh sách danh mục món ăn (ẩn khi đang chọn tab Combo) */}
            {catalogTab !== "COMBO" && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MOCK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category_id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.category_id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                      selectedCategoryId === cat.category_id
                        ? "bg-[var(--btn-secondary-default)] text-[var(--text-inverse)] border-[var(--btn-secondary-default)]"
                        : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-light)] hover:border-[var(--btn-secondary-default)]"
                    }`}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            )}

            {/* Ô tìm kiếm nhanh theo tên / mô tả */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search dishes, combos, or deals..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
              />
            </div>

            {/* Danh sách cuộn các Combo và Món ăn phù hợp bộ lọc */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredCombos.map((combo) => (
                <BannerCatalogItem
                  key={`combo-${combo.combo_id}`}
                  item={combo}
                  type="combo"
                  isSelected={
                    draft.source_type === "COMBO" &&
                    Number(draft.combo_id) === combo.combo_id
                  }
                  onSelectCombo={handleApplyComboToBanner}
                />
              ))}

              {filteredProducts.map((product) => (
                <BannerCatalogItem
                  key={`prod-${product.product_id}`}
                  item={product}
                  type="product"
                  isSelected={
                    draft.source_type === "PRODUCT" &&
                    Number(draft.product_id) === product.product_id
                  }
                  onSelectProductSize={handleApplyProductToBanner}
                />
              ))}

              {filteredCombos.length === 0 && filteredProducts.length === 0 && (
                <div className="py-10 text-center text-xs text-[var(--text-muted)]">
                  No menu items or combos match your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem trước Banner toàn màn hình */}
      {showPreviewModal && (
        <BannerPreviewModal
          banner={draft}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </div>
  );
}

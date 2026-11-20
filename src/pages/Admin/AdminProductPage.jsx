import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FolderPlus,
  UtensilsCrossed,
  CircleCheck,
  PackageX,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAdminCatalogStore } from "../../store/useAdminCatalogStore";
import AdminKpiCard from "../../components/AdminKpiCard";
import ProductTableRow from "../../components/ProductTableRow";
import ProductMobileCard from "../../components/ProductMobileCard";
import ProductFormModal from "../../components/ProductFormModal";
import CategoryFormModal from "../../components/CategoryFormModal";
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_OPTIONS,
} from "../../components/productConstants";

// Mã tab lọc: category 0 = tất cả (trùng với "All Menu" trong MOCK_CATEGORIES)
const ALL_CATEGORIES_ID = 0;

// Bộ lọc theo trạng thái bán (Tất cả + từng trạng thái trong PRODUCT_STATUS_OPTIONS)
const STATUS_FILTERS = [
  { key: "ALL", label: "All Status" },
  ...PRODUCT_STATUS_OPTIONS.map((opt) => ({
    key: opt.value,
    label: opt.label,
  })),
];

// Chuẩn hóa trạng thái: giá trị lạ (không thuộc 3 trạng thái) xem như AVAILABLE
const normalizeStatus = (status) =>
  PRODUCT_STATUS_OPTIONS.some((opt) => opt.value === status)
    ? status
    : PRODUCT_STATUS.AVAILABLE;

// Class dùng chung cho tab lọc (giống trang Quản lý nhân sự)
const getTabClass = (isActive) =>
  `px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
    isActive
      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
      : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
  }`;

// Class cho chip lọc trạng thái (nhỏ hơn tab category)
const getStatusChipClass = (isActive) =>
  `px-3 py-1.5 rounded-full text-[11px] font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
    isActive
      ? "bg-[var(--bg-dark)] text-[var(--text-inverse)] border-[var(--bg-dark)]"
      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--text-primary)]"
  }`;

export default function AdminProductPage() {
  // Dữ liệu món, category, add-on lấy từ store dùng chung với trang Add-on
  const products = useAdminCatalogStore((s) => s.products);
  const allCategories = useAdminCatalogStore((s) => s.productCategories);
  const addons = useAdminCatalogStore((s) => s.addons);
  const addonCategories = useAdminCatalogStore((s) => s.addonCategories);
  const productAddons = useAdminCatalogStore((s) => s.productAddons);
  const comboDetails = useAdminCatalogStore((s) => s.comboDetails);
  const addProduct = useAdminCatalogStore((s) => s.addProduct);
  const updateProduct = useAdminCatalogStore((s) => s.updateProduct);
  const setProductStatus = useAdminCatalogStore((s) => s.setProductStatus);
  const addProductCategory = useAdminCatalogStore((s) => s.addProductCategory);

  // State lọc theo category, trạng thái bán và ô tìm kiếm
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(ALL_CATEGORIES_ID);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý Modal thêm/sửa món, Modal thêm category và Toast thông báo
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Hiển thị thông báo ngắn trong 3 giây
  const triggerToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Category thật của món (bỏ mục 0 "All Menu" chỉ dùng làm tab phía Customer)
  const categories = useMemo(
    () => allCategories.filter((c) => c.category_id !== ALL_CATEGORIES_ID),
    [allCategories],
  );

  const getCategoryName = (categoryId) =>
    categories.find((c) => c.category_id === categoryId)?.category_name ||
    "Uncategorized";

  const getCategoryColorIndex = (categoryId) =>
    categories.findIndex((c) => c.category_id === categoryId);

  // Danh sách addon_id và tên add-on của từng món (PRODUCT_ADDON join ADD_ON)
  const addonIdsByProduct = useMemo(
    () =>
      productAddons.reduce((map, pa) => {
        (map[pa.product_id] ||= []).push(pa.addon_id);
        return map;
      }, {}),
    [productAddons],
  );

  const getAddonNames = (productId) =>
    (addonIdsByProduct[productId] || [])
      .map((id) => addons.find((a) => a.addon_id === id)?.addon_name)
      .filter(Boolean);

  // Thống kê cho thẻ KPI và số lượng trên từng tab
  const productStats = useMemo(() => {
    const countByCategory = {};
    const countByStatus = {};
    products.forEach((p) => {
      countByCategory[p.category_id] =
        (countByCategory[p.category_id] || 0) + 1;
      const status = normalizeStatus(p.status);
      countByStatus[status] = (countByStatus[status] || 0) + 1;
    });
    return {
      total: products.length,
      countByCategory,
      countByStatus,
    };
  }, [products]);

  // Lọc danh sách theo category, trạng thái và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCategory =
        selectedCategoryId === ALL_CATEGORIES_ID ||
        p.category_id === selectedCategoryId;
      const matchStatus =
        statusFilter === "ALL" || normalizeStatus(p.status) === statusFilter;
      const matchSearch =
        p.product_name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      return matchCategory && matchStatus && matchSearch;
    });
  }, [products, selectedCategoryId, statusFilter, searchQuery]);

  // Mở Modal ở chế độ Thêm mới hoặc Chỉnh sửa món
  const openCreateModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Lưu món sau khi submit form (kèm size và danh sách add-on)
  const handleSaveProduct = ({ values, sizes, addonIds }) => {
    if (editingProduct) {
      updateProduct(editingProduct.product_id, values, sizes, addonIds);
      triggerToast(`Updated product "${values.product_name}" successfully.`);
    } else {
      addProduct(values, sizes, addonIds);
      triggerToast(
        `Created new product "${values.product_name}" with ${addonIds.length} add-on${addonIds.length === 1 ? "" : "s"}.`,
      );
    }
    closeProductModal();
  };

  // Đổi trạng thái món ngay trên bảng (Available / Sold Out / Unavailable)
  const STATUS_TOAST = {
    [PRODUCT_STATUS.AVAILABLE]: "is now available to customers.",
    [PRODUCT_STATUS.SOLD_OUT]: "is now marked as sold out.",
    [PRODUCT_STATUS.UNAVAILABLE]: "is now hidden from customers.",
  };

  const handleChangeStatus = (product, status) => {
    if (normalizeStatus(product.status) === status) return;
    setProductStatus(product.product_id, status);
    triggerToast(`"${product.product_name}" ${STATUS_TOAST[status]}`);
  };

  // Thêm category món mới và chuyển sang tab của category đó
  const handleSaveCategory = ({ category_name }) => {
    const newCategoryId = addProductCategory(category_name);
    setSelectedCategoryId(newCategoryId);
    setIsCategoryModalOpen(false);
    triggerToast(`Created new category "${category_name}".`);
  };

  // Các product_size_id đang nằm trong combo (COMBO_DETAIL, gồm cả combo mới tạo) -> không cho bỏ size đó
  const comboProductSizeIds = new Set(
    comboDetails.map((cd) => cd.product_size_id),
  );

  // Các size của món đang sửa nằm trong combo (không được bỏ chọn)
  const lockedSizeIds = editingProduct
    ? (editingProduct.sizes || [])
        .filter((s) => comboProductSizeIds.has(s.product_size_id))
        .map((s) => s.size_id)
    : [];

  const emptyMessage =
    products.length === 0
      ? "No products yet. Create your first menu item to get started."
      : "No products match your filters.";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--bg-main)] text-[var(--text-primary)] selection:bg-[var(--border-active)] selection:text-[var(--text-inverse)] pt-[72px]">
      {/* Thông báo Toast nổi góc dưới (trải ngang trên điện thoại) */}
      {toastMessage && (
        <div className="fixed left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex items-center gap-3 px-5 py-3.5 shadow-[var(--shadow-lg)] border-2 border-[var(--border-light)] bg-[var(--bg-dark)] text-[var(--text-inverse)]">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* ================= 1. TIÊU ĐỀ TRANG & NÚT THÊM MÓN / CATEGORY ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <UtensilsCrossed size={14} /> Kitchen Menu Catalog
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Product Management
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
              Add menu items with sizes and add-ons, set each item as available,
              sold out or unavailable (hidden from customers), and organize them
              by category.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto sm:gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--bg-surface)] text-[var(--text-secondary)] border-2 border-[var(--border-divider)] hover:border-[var(--btn-primary-default)] hover:text-[var(--btn-primary-default)] transition-all cursor-pointer"
            >
              <FolderPlus size={16} />
              <span>
                <span className="hidden sm:inline">Add </span>Category
              </span>
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] shadow-[var(--shadow-md)] transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>
                <span className="hidden sm:inline">Add New </span>Product
              </span>
            </button>
          </div>
        </div>

        {/* ================= 2. THẺ KPI TỔNG QUAN MÓN (TÁI SỬ DỤNG AdminKpiCard) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <AdminKpiCard
            title="Total Products"
            value={productStats.total}
            subtext={`${categories.length} categories`}
            icon={<UtensilsCrossed size={22} />}
            accentColor="var(--btn-primary-default)"
          />
          <AdminKpiCard
            title="Available"
            value={productStats.countByStatus[PRODUCT_STATUS.AVAILABLE] || 0}
            subtext="Customers can order"
            icon={<CircleCheck size={22} />}
            accentColor="var(--status-success)"
          />
          <AdminKpiCard
            title="Sold Out"
            value={productStats.countByStatus[PRODUCT_STATUS.SOLD_OUT] || 0}
            subtext="Visible, cannot order"
            icon={<PackageX size={22} />}
            accentColor="var(--status-warning)"
          />
          <AdminKpiCard
            title="Unavailable"
            value={productStats.countByStatus[PRODUCT_STATUS.UNAVAILABLE] || 0}
            subtext="Hidden from customers"
            icon={<EyeOff size={22} />}
            accentColor="var(--text-muted)"
          />
        </div>

        {/* ================= 3. DANH SÁCH MÓN & BỘ LỌC ================= */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Thanh lọc: tab category, trạng thái bán, ô tìm kiếm (mỗi phần một hàng) */}
          <div className="p-4 sm:p-6 border-b-2 border-[var(--border-divider)] space-y-3">
            {/* Hàng 1: tab category (điện thoại cuộn ngang, từ sm trở lên tự xuống dòng) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(ALL_CATEGORIES_ID)}
                className={getTabClass(
                  selectedCategoryId === ALL_CATEGORIES_ID,
                )}
              >
                All Products ({productStats.total})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.category_id)}
                  className={getTabClass(
                    selectedCategoryId === cat.category_id,
                  )}
                >
                  {cat.category_name} (
                  {productStats.countByCategory[cat.category_id] || 0})
                </button>
              ))}
            </div>

            {/* Hàng 2: chip lọc trạng thái bán */}
            <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={getStatusChipClass(statusFilter === f.key)}
                >
                  {f.label} (
                  {f.key === "ALL"
                    ? productStats.total
                    : productStats.countByStatus[f.key] || 0}
                  )
                </button>
              ))}
            </div>

            {/* Hàng 3: ô tìm kiếm món */}
            <div className="relative w-full sm:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name or description..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
              />
            </div>
          </div>

          {/* Bảng dữ liệu món (màn hình từ md trở lên) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Sizes & Price</th>
                  <th className="px-6 py-4">Add-ons</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] text-sm">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.product_id}
                      product={product}
                      categoryName={getCategoryName(product.category_id)}
                      colorIndex={getCategoryColorIndex(product.category_id)}
                      addonNames={getAddonNames(product.product_id)}
                      onChangeStatus={handleChangeStatus}
                      onEdit={openEditModal}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-xs font-medium text-[var(--text-muted)]"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Danh sách thẻ món (điện thoại, nhỏ hơn md) */}
          <div className="md:hidden divide-y divide-[var(--border-light)]">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductMobileCard
                  key={product.product_id}
                  product={product}
                  categoryName={getCategoryName(product.category_id)}
                  colorIndex={getCategoryColorIndex(product.category_id)}
                  addonNames={getAddonNames(product.product_id)}
                  onChangeStatus={handleChangeStatus}
                  onEdit={openEditModal}
                />
              ))
            ) : (
              <p className="px-4 py-12 text-center text-xs font-medium text-[var(--text-muted)]">
                {emptyMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal thêm mới hoặc chỉnh sửa món */}
      {isProductModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          addons={addons}
          addonCategories={addonCategories}
          initialAddonIds={
            editingProduct
              ? addonIdsByProduct[editingProduct.product_id] || []
              : []
          }
          lockedSizeIds={lockedSizeIds}
          existingNames={products.map((p) => p.product_name)}
          onClose={closeProductModal}
          onSubmit={handleSaveProduct}
        />
      )}

      {/* Modal thêm category món mới */}
      {isCategoryModalOpen && (
        <CategoryFormModal
          eyebrow="Kitchen Menu Catalog"
          title="Add Product Category"
          placeholder="e.g. Rice Bowls"
          existingNames={allCategories.map((c) => c.category_name)}
          onClose={() => setIsCategoryModalOpen(false)}
          onSubmit={handleSaveCategory}
        />
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FolderPlus,
  Puzzle,
  Layers,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAdminCatalogStore } from "../../store/useAdminCatalogStore";
import AdminKpiCard from "../../components/AdminKpiCard";
import AddOnTableRow from "../../components/AddOnTableRow";
import AddOnMobileCard from "../../components/AddOnMobileCard";
import AddOnFormModal from "../../components/AddOnFormModal";
import CategoryFormModal from "../../components/CategoryFormModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

// Mã tab lọc đặc biệt: 0 = tất cả, -1 = add-on chưa có category (ADD_ON.category_id cho phép null)
const ALL_CATEGORIES_ID = 0;
const UNCATEGORIZED_ID = -1;

// Class dùng chung cho tab lọc (giống trang Quản lý nhân sự)
const getTabClass = (isActive) =>
  `px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
    isActive
      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
      : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
  }`;

export default function AdminAddOnPage() {
  // Danh sách add-on, category add-on và liên kết PRODUCT_ADDON lấy từ store dùng chung với trang Product
  const addons = useAdminCatalogStore((s) => s.addons);
  const categories = useAdminCatalogStore((s) => s.addonCategories);
  const productAddons = useAdminCatalogStore((s) => s.productAddons);
  const products = useAdminCatalogStore((s) => s.products);
  const addAddon = useAdminCatalogStore((s) => s.addAddon);
  const updateAddon = useAdminCatalogStore((s) => s.updateAddon);
  const deleteAddon = useAdminCatalogStore((s) => s.deleteAddon);
  const addAddonCategory = useAdminCatalogStore((s) => s.addAddonCategory);

  // State lọc theo category và ô tìm kiếm
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(ALL_CATEGORIES_ID);
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý Modal thêm/sửa add-on, Modal thêm category và Toast thông báo
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Hiển thị thông báo ngắn trong 3 giây
  const triggerToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lấy tên category và vị trí màu badge theo category_id
  const getCategoryName = (categoryId) =>
    categories.find((c) => c.category_id === categoryId)?.category_name ||
    "Uncategorized";

  const getCategoryColorIndex = (categoryId) =>
    categories.findIndex((c) => c.category_id === categoryId);

  // Tên các món đang dùng từng add-on (PRODUCT_ADDON join PRODUCT), cập nhật theo trang Product
  const linkedProductsByAddon = useMemo(
    () =>
      productAddons.reduce((map, row) => {
        const name = products.find(
          (p) => p.product_id === row.product_id,
        )?.product_name;
        if (!name) return map;
        const list = (map[row.addon_id] ||= []);
        if (!list.includes(name)) list.push(name);
        return map;
      }, {}),
    [productAddons, products],
  );

  // Thống kê cho thẻ KPI và số lượng trên từng tab
  const addonStats = useMemo(() => {
    const countByCategory = {};
    let uncategorized = 0;
    let totalPrice = 0;

    addons.forEach((a) => {
      totalPrice += a.price;
      if (a.category_id === null || a.category_id === undefined) {
        uncategorized += 1;
      } else {
        countByCategory[a.category_id] =
          (countByCategory[a.category_id] || 0) + 1;
      }
    });

    return {
      total: addons.length,
      categoryCount: categories.length,
      avgPrice: addons.length > 0 ? totalPrice / addons.length : 0,
      countByCategory,
      uncategorized,
    };
  }, [addons, categories]);

  // Nếu đang ở tab Uncategorized mà không còn add-on nào thì quay về tab tất cả
  const activeCategoryId =
    selectedCategoryId === UNCATEGORIZED_ID && addonStats.uncategorized === 0
      ? ALL_CATEGORIES_ID
      : selectedCategoryId;

  // Lọc danh sách hiển thị theo tab category và từ khóa tìm kiếm
  const filteredAddons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return addons.filter((a) => {
      const matchCategory =
        activeCategoryId === ALL_CATEGORIES_ID ||
        (activeCategoryId === UNCATEGORIZED_ID
          ? a.category_id === null || a.category_id === undefined
          : a.category_id === activeCategoryId);
      const matchSearch =
        a.addon_name.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [addons, activeCategoryId, searchQuery]);

  // Mở Modal ở chế độ Thêm mới hoặc Chỉnh sửa add-on
  const openCreateModal = () => {
    setEditingAddon(null);
    setIsAddonModalOpen(true);
  };

  const openEditModal = (addon) => {
    setEditingAddon(addon);
    setIsAddonModalOpen(true);
  };

  const closeAddonModal = () => {
    setIsAddonModalOpen(false);
    setEditingAddon(null);
  };

  // Xử lý lưu add-on sau khi submit form trong Modal
  const handleSaveAddon = (formValues) => {
    if (editingAddon) {
      // Cập nhật thông tin add-on hiện có
      updateAddon(editingAddon.addon_id, formValues);
      triggerToast(`Updated add-on "${formValues.addon_name}" successfully.`);
    } else {
      // Thêm add-on mới lên đầu danh sách
      addAddon(formValues);
      triggerToast(`Created new add-on "${formValues.addon_name}".`);
    }

    closeAddonModal();
  };

  // Xử lý thêm category add-on mới và chuyển sang tab của category đó
  const handleSaveCategory = ({ category_name }) => {
    const newCategoryId = addAddonCategory(category_name);
    setSelectedCategoryId(newCategoryId);
    setIsCategoryModalOpen(false);
    triggerToast(`Created new category "${category_name}".`);
  };

  // Yêu cầu xóa add-on: nếu đang có món dùng (PRODUCT_ADDON) thì chỉ cảnh báo, không cho xóa
  const handleRequestDelete = (addon) => {
    setDeletingAddon({
      addon,
      isUsed: (linkedProductsByAddon[addon.addon_id] || []).length > 0,
    });
  };

  // Xác nhận xóa add-on khỏi danh sách
  const handleConfirmDelete = () => {
    if (!deletingAddon || deletingAddon.isUsed) return;
    deleteAddon(deletingAddon.addon.addon_id);
    triggerToast(`Removed add-on "${deletingAddon.addon.addon_name}".`);
    setDeletingAddon(null);
  };

  // Thông báo khi danh sách rỗng
  const emptyMessage =
    addons.length === 0
      ? "No add-ons yet. Create your first add-on to get started."
      : "No add-ons match your search criteria.";

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
        {/* ================= 1. TIÊU ĐỀ TRANG & NÚT THÊM ADD-ON / CATEGORY ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <Puzzle size={14} /> Menu Extras Catalog
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Add-on Management
            </h1>
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
                <span className="hidden sm:inline">Add New </span>Add-on
              </span>
            </button>
          </div>
        </div>

        {/* ================= 2. THẺ KPI TỔNG QUAN ADD-ON (TÁI SỬ DỤNG AdminKpiCard) ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          <AdminKpiCard
            title="Total Add-ons"
            value={addonStats.total}
            subtext="Extras on the menu"
            icon={<Puzzle size={22} />}
            accentColor="var(--btn-primary-default)"
          />
          <AdminKpiCard
            title="Categories"
            value={addonStats.categoryCount}
            subtext="Add-on groups"
            icon={<Layers size={22} />}
            accentColor="var(--btn-secondary-default)"
          />
          <div className="col-span-2 sm:col-span-1 grid">
            <AdminKpiCard
              title="Average Price"
              value={`$${addonStats.avgPrice.toFixed(2)}`}
              subtext="Per add-on item"
              icon={<DollarSign size={22} />}
              accentColor="var(--btn-accent-default)"
            />
          </div>
        </div>

        {/* ================= 3. DANH SÁCH ADD-ON & BỘ LỌC THEO CATEGORY ================= */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Thanh lọc theo category & tìm kiếm */}
          <div className="p-4 sm:p-6 border-b-2 border-[var(--border-divider)] flex flex-col gap-4">
            {/* Hàng 1: tab category (điện thoại cuộn ngang, từ sm trở lên tự xuống dòng) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0 sm:flex-wrap sm:overflow-visible sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCategoryId(ALL_CATEGORIES_ID)}
                className={getTabClass(activeCategoryId === ALL_CATEGORIES_ID)}
              >
                All Add-ons ({addonStats.total})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.category_id)}
                  className={getTabClass(activeCategoryId === cat.category_id)}
                >
                  {cat.category_name} (
                  {addonStats.countByCategory[cat.category_id] || 0})
                </button>
              ))}

              {addonStats.uncategorized > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(UNCATEGORIZED_ID)}
                  className={getTabClass(activeCategoryId === UNCATEGORIZED_ID)}
                >
                  Uncategorized ({addonStats.uncategorized})
                </button>
              )}
            </div>

            {/* Hàng 2: ô tìm kiếm add-on */}
            <div className="relative w-full sm:max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by add-on name or description..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
              />
            </div>
          </div>

          {/* Bảng dữ liệu add-on (màn hình từ md trở lên) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
                  <th className="px-6 py-4">Add-on</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="hidden lg:table-cell px-6 py-4">
                    Description
                  </th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Used In</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] text-sm">
                {filteredAddons.length > 0 ? (
                  filteredAddons.map((addon) => (
                    <AddOnTableRow
                      key={addon.addon_id}
                      addon={addon}
                      categoryName={getCategoryName(addon.category_id)}
                      colorIndex={getCategoryColorIndex(addon.category_id)}
                      linkedProductNames={
                        linkedProductsByAddon[addon.addon_id] || []
                      }
                      onEdit={openEditModal}
                      onDelete={handleRequestDelete}
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

          {/* Danh sách thẻ add-on (điện thoại, nhỏ hơn md) */}
          <div className="md:hidden divide-y divide-[var(--border-light)]">
            {filteredAddons.length > 0 ? (
              filteredAddons.map((addon) => (
                <AddOnMobileCard
                  key={addon.addon_id}
                  addon={addon}
                  categoryName={getCategoryName(addon.category_id)}
                  colorIndex={getCategoryColorIndex(addon.category_id)}
                  linkedProductNames={
                    linkedProductsByAddon[addon.addon_id] || []
                  }
                  onEdit={openEditModal}
                  onDelete={handleRequestDelete}
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

      {/* Modal thêm mới hoặc chỉnh sửa add-on */}
      {isAddonModalOpen && (
        <AddOnFormModal
          addon={editingAddon}
          categories={categories}
          existingNames={addons.map((a) => a.addon_name)}
          onClose={closeAddonModal}
          onSubmit={handleSaveAddon}
        />
      )}

      {/* Modal thêm category add-on mới */}
      {isCategoryModalOpen && (
        <CategoryFormModal
          eyebrow="Add-on Catalog"
          title="Add Add-on Category"
          placeholder="e.g. Crunchy Toppings"
          existingNames={categories.map((c) => c.category_name)}
          onClose={() => setIsCategoryModalOpen(false)}
          onSubmit={handleSaveCategory}
        />
      )}

      {/* Modal xác nhận xóa add-on / cảnh báo add-on đang có món dùng */}
      {deletingAddon &&
        (deletingAddon.isUsed ? (
          <ConfirmDeleteModal
            title="Cannot Delete Add-on"
            message={`"${deletingAddon.addon.addon_name}" is currently used by products. Remove it from those products first, then try deleting again.`}
            canConfirm={false}
            linkTo="/admin/product"
            linkLabel="Go to Products"
            onCancel={() => setDeletingAddon(null)}
          />
        ) : (
          <ConfirmDeleteModal
            title="Delete Add-on"
            message={`Are you sure you want to delete "${deletingAddon.addon.addon_name}"? This action cannot be undone.`}
            confirmLabel="Delete Add-on"
            onCancel={() => setDeletingAddon(null)}
            onConfirm={handleConfirmDelete}
          />
        ))}
    </div>
  );
}

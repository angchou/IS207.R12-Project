import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Package,
  CircleCheck,
  EyeOff,
  Percent,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAdminCatalogStore } from "../../store/useAdminCatalogStore";
import AdminKpiCard from "../../components/AdminKpiCard";
import ComboTableRow from "../../components/ComboTableRow";
import ComboMobileCard from "../../components/ComboMobileCard";
import ComboFormModal from "../../components/ComboFormModal";
import {
  COMBO_STATUS,
  buildSizeIndex,
  groupComboItems,
  getComboBlockers,
} from "../../components/comboConstants";

// Bộ lọc theo trạng thái combo
const STATUS_FILTERS = [
  { key: "ALL", label: "All Combos" },
  { key: COMBO_STATUS.AVAILABLE, label: "Available" },
  { key: COMBO_STATUS.UNAVAILABLE, label: "Unavailable" },
];

// Chuẩn hóa trạng thái: mọi giá trị khác UNAVAILABLE xem như đang mở bán
const normalizeStatus = (status) =>
  status === COMBO_STATUS.UNAVAILABLE
    ? COMBO_STATUS.UNAVAILABLE
    : COMBO_STATUS.AVAILABLE;

// Class dùng chung cho tab lọc (giống trang Quản lý nhân sự)
const getTabClass = (isActive) =>
  `px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all cursor-pointer ${
    isActive
      ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
      : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
  }`;

export default function AdminComboPage() {
  // Dữ liệu combo, COMBO_DETAIL và món ăn lấy từ store dùng chung
  const combos = useAdminCatalogStore((s) => s.combos);
  const comboDetails = useAdminCatalogStore((s) => s.comboDetails);
  const products = useAdminCatalogStore((s) => s.products);
  const addCombo = useAdminCatalogStore((s) => s.addCombo);
  const updateCombo = useAdminCatalogStore((s) => s.updateCombo);
  const toggleComboStatus = useAdminCatalogStore((s) => s.toggleComboStatus);

  // State lọc theo trạng thái và ô tìm kiếm
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State quản lý Modal tạo/sửa combo và Toast thông báo
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Hiển thị thông báo ngắn trong 3 giây
  const triggerToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Danh sách món trong từng combo (gộp dòng COMBO_DETAIL) và các món đang chặn combo
  const comboInfo = useMemo(() => {
    const sizeIndex = buildSizeIndex(products);
    const info = {};
    combos.forEach((combo) => {
      const items = groupComboItems(combo.combo_id, comboDetails, sizeIndex);
      info[combo.combo_id] = { items, blockers: getComboBlockers(items) };
    });
    return info;
  }, [combos, comboDetails, products]);

  // Thống kê cho thẻ KPI và chip lọc
  const comboStats = useMemo(() => {
    const countByStatus = {};
    let savingSum = 0;
    let savingCount = 0;
    combos.forEach((c) => {
      const status = normalizeStatus(c.status);
      countByStatus[status] = (countByStatus[status] || 0) + 1;
      if (c.original_price > 0) {
        savingSum += (c.original_price - c.price) / c.original_price;
        savingCount += 1;
      }
    });
    const notOrderable = combos.filter(
      (c) =>
        normalizeStatus(c.status) === COMBO_STATUS.AVAILABLE &&
        (comboInfo[c.combo_id]?.blockers.length || 0) > 0,
    ).length;
    return {
      total: combos.length,
      countByStatus,
      avgSaving:
        savingCount > 0 ? Math.round((savingSum / savingCount) * 100) : 0,
      notOrderable,
    };
  }, [combos, comboInfo]);

  // Lọc danh sách theo trạng thái và từ khóa tìm kiếm
  const filteredCombos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return combos.filter((c) => {
      const matchStatus =
        statusFilter === "ALL" || normalizeStatus(c.status) === statusFilter;
      const matchSearch =
        c.combo_name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.badge || "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [combos, statusFilter, searchQuery]);

  // Mở Modal ở chế độ Tạo mới hoặc Chỉnh sửa combo
  const openCreateModal = () => {
    setEditingCombo(null);
    setIsComboModalOpen(true);
  };

  const openEditModal = (combo) => {
    setEditingCombo(combo);
    setIsComboModalOpen(true);
  };

  const closeComboModal = () => {
    setIsComboModalOpen(false);
    setEditingCombo(null);
  };

  // Lưu combo sau khi submit form
  const handleSaveCombo = ({ values, items }) => {
    if (editingCombo) {
      updateCombo(editingCombo.combo_id, values, items);
      triggerToast(`Updated combo "${values.combo_name}" successfully.`);
    } else {
      addCombo(values, items);
      triggerToast(`Created new combo "${values.combo_name}".`);
    }
    closeComboModal();
  };

  // Mở bán / ngừng bán combo ngay trên bảng
  const handleToggleStatus = (combo) => {
    toggleComboStatus(combo.combo_id);
    const nowAvailable =
      normalizeStatus(combo.status) === COMBO_STATUS.UNAVAILABLE;
    triggerToast(
      nowAvailable
        ? `"${combo.combo_name}" is now available to customers.`
        : `"${combo.combo_name}" is now hidden from customers.`,
    );
  };

  const emptyMessage =
    combos.length === 0
      ? "No combos yet. Create your first combo deal to get started."
      : "No combos match your filters.";

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
        {/* ================= 1. TIÊU ĐỀ TRANG & NÚT TẠO COMBO ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 border-b-2 border-[var(--border-divider)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--btn-primary-default)] uppercase tracking-wider mb-2 bg-[var(--bg-badge-discount)] px-3.5 py-1 rounded-full border border-[var(--border-active)]/20">
              <Package size={14} /> Value Meal Boxes
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Combo Management
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium mt-1">
              Build combo deals from existing menu items, set a bundle price,
              and switch combos on or off for customers.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] text-[var(--text-inverse)] shadow-[var(--shadow-md)] transition-all cursor-pointer self-start lg:self-auto"
          >
            <Plus size={16} /> Create Combo
          </button>
        </div>

        {/* ================= 2. THẺ KPI TỔNG QUAN COMBO (TÁI SỬ DỤNG AdminKpiCard) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <AdminKpiCard
            title="Total Combos"
            value={comboStats.total}
            subtext="Combo deals"
            icon={<Package size={22} />}
            accentColor="var(--btn-primary-default)"
          />
          <AdminKpiCard
            title="Available"
            value={comboStats.countByStatus[COMBO_STATUS.AVAILABLE] || 0}
            subtext={
              comboStats.notOrderable > 0
                ? `${comboStats.notOrderable} not orderable`
                : "Shown to customers"
            }
            icon={<CircleCheck size={22} />}
            accentColor="var(--status-success)"
          />
          <AdminKpiCard
            title="Unavailable"
            value={comboStats.countByStatus[COMBO_STATUS.UNAVAILABLE] || 0}
            subtext="Hidden from customers"
            icon={<EyeOff size={22} />}
            accentColor="var(--text-muted)"
          />
          <AdminKpiCard
            title="Avg. Savings"
            value={`${comboStats.avgSaving}%`}
            subtext="Vs. ordering separately"
            icon={<Percent size={22} />}
            accentColor="var(--btn-secondary-default)"
          />
        </div>

        {/* ================= 3. DANH SÁCH COMBO & BỘ LỌC ================= */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-divider)] shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Thanh lọc theo trạng thái & tìm kiếm */}
          <div className="p-4 sm:p-6 border-b-2 border-[var(--border-divider)] flex flex-col xl:flex-row justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 min-w-0">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={getTabClass(statusFilter === f.key)}
                >
                  {f.label} (
                  {f.key === "ALL"
                    ? comboStats.total
                    : comboStats.countByStatus[f.key] || 0}
                  )
                </button>
              ))}
            </div>

            {/* Ô tìm kiếm combo */}
            <div className="relative w-full xl:w-80 shrink-0">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description or badge..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-full border border-[var(--border-divider)] bg-[var(--bg-main)] text-base sm:text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--btn-primary-default)]"
              />
            </div>
          </div>

          {/* Bảng dữ liệu combo (màn hình từ md trở lên) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-black uppercase tracking-wider border-b-2 border-[var(--border-divider)]">
                  <th className="px-6 py-4">Combo</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)] text-sm">
                {filteredCombos.length > 0 ? (
                  filteredCombos.map((combo) => (
                    <ComboTableRow
                      key={combo.combo_id}
                      combo={combo}
                      items={comboInfo[combo.combo_id]?.items || []}
                      blockers={comboInfo[combo.combo_id]?.blockers || []}
                      onToggleStatus={handleToggleStatus}
                      onEdit={openEditModal}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-xs font-medium text-[var(--text-muted)]"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Danh sách thẻ combo (điện thoại, nhỏ hơn md) */}
          <div className="md:hidden divide-y divide-[var(--border-light)]">
            {filteredCombos.length > 0 ? (
              filteredCombos.map((combo) => (
                <ComboMobileCard
                  key={combo.combo_id}
                  combo={combo}
                  items={comboInfo[combo.combo_id]?.items || []}
                  blockers={comboInfo[combo.combo_id]?.blockers || []}
                  onToggleStatus={handleToggleStatus}
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

      {/* Modal tạo mới hoặc chỉnh sửa combo */}
      {isComboModalOpen && (
        <ComboFormModal
          combo={editingCombo}
          initialItems={
            editingCombo ? comboInfo[editingCombo.combo_id]?.items || [] : []
          }
          products={products}
          existingNames={combos.map((c) => c.combo_name)}
          onClose={closeComboModal}
          onSubmit={handleSaveCombo}
        />
      )}
    </div>
  );
}

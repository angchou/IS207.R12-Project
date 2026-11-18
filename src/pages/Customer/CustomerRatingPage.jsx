import { useState } from "react";
import { Star, CheckCircle2, RotateCcw, Utensils, Clock } from "lucide-react";
import { MOCK_ACCOUNT } from "../../data/mockData";
import { useShipperOrderStore } from "../../store/useShipperOrderStore";

const RATING_FILTER_TABS = [
  { key: "ALL", label: "All Completed" },
  { key: "UNRATED", label: "Not Rated Yet" },
  { key: "RATED", label: "Rated" },
];

export default function CustomerRatingPage() {
  useShipperOrderStore((state) => state.rawOrders);
  useShipperOrderStore((state) => state.orderStatuses);
  const getHydratedOrders = useShipperOrderStore(
    (state) => state.getHydratedOrders
  );
  const rateOrder = useShipperOrderStore((state) => state.rateOrder);
  const resetDemoOrders = useShipperOrderStore(
    (state) => state.resetDemoOrders
  );

  const [filterTab, setFilterTab] = useState("ALL");
  // Track selected star (1-5) and hover star per unrated order_id
  const [selectedStarsMap, setSelectedStarsMap] = useState({});
  const [hoveredStarsMap, setHoveredStarsMap] = useState({});
  const [lastRatedOrderId, setLastRatedOrderId] = useState(null);

  // Completed orders belonging to the customer (ORDER.account_id === MOCK_ACCOUNT.account_id)
  const completedOrders = getHydratedOrders().filter(
    (order) =>
      order.account_id === MOCK_ACCOUNT.account_id &&
      order.current_status === "COMPLETED"
  );

  const unratedCount = completedOrders.filter((o) => o.rating === 0).length;
  const ratedCount = completedOrders.filter((o) => o.rating > 0).length;

  const filteredOrders = completedOrders.filter((order) => {
    if (filterTab === "UNRATED") return order.rating === 0;
    if (filterTab === "RATED") return order.rating > 0;
    return true;
  });

  const handleSelectStar = (orderId, starValue) => {
    setSelectedStarsMap((prev) => ({
      ...prev,
      [orderId]: starValue,
    }));
  };

  const handleHoverStar = (orderId, starValue) => {
    setHoveredStarsMap((prev) => ({
      ...prev,
      [orderId]: starValue,
    }));
  };

  const handleSubmitRating = (orderId) => {
    const score = selectedStarsMap[orderId];
    if (!score || score < 1 || score > 5) return;
    rateOrder(orderId, score);
    setLastRatedOrderId(orderId);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] font-sans pt-[72px] pb-14">
      {/* Compact Header Banner */}
      <section className="bg-[var(--bg-dark)] text-[var(--text-inverse)] border-b-4 border-[var(--btn-primary-default)] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--btn-secondary-default)] text-[var(--text-inverse)] text-xs font-black uppercase tracking-wider mb-2">
              <Star size={13} fill="currentColor" />
              Customer Order Rating
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Rate Your Completed Orders
            </h1>
            <p className="text-xs text-[var(--border-light)] mt-1">
              @{MOCK_ACCOUNT.username} (account_id #{MOCK_ACCOUNT.account_id}) •{" "}
              Each completed order can be rated once from 1 to 5 stars.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetDemoOrders();
              setSelectedStarsMap({});
              setLastRatedOrderId(null);
            }}
            className="px-4 py-2 rounded-full bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <RotateCcw size={13} />
            Reset Demo
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        {/* Feedback Banner after rating */}
        {lastRatedOrderId && (
          <div className="bg-[var(--bg-surface)] border-2 border-[var(--status-success)] border-l-8 p-3.5 shadow-[var(--shadow-sm)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs">
              <CheckCircle2
                size={18}
                className="text-[var(--status-success)] shrink-0"
              />
              <span className="font-bold text-[var(--text-primary)]">
                Thank you! Rating for <strong>#ORD-{lastRatedOrderId}</strong>{" "}
                has been saved.
              </span>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] p-3.5 shadow-[var(--shadow-sm)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {RATING_FILTER_TABS.map((tab) => {
              const isActive = filterTab === tab.key;
              const count =
                tab.key === "ALL"
                  ? completedOrders.length
                  : tab.key === "UNRATED"
                    ? unratedCount
                    : ratedCount;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key)}
                  className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider border-2 transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? "bg-[var(--btn-primary-default)] text-[var(--text-inverse)] border-[var(--btn-primary-default)]"
                    : "bg-[var(--bg-main)] text-[var(--text-primary)] border-[var(--border-divider)] hover:border-[var(--btn-primary-default)]"
                    }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          <span className="text-xs font-bold text-[var(--text-secondary)]">
            Waiting for rating:{" "}
            <strong className="text-[var(--btn-primary-default)]">
              {unratedCount}
            </strong>
          </span>
        </div>

        {/* Completed Orders Rating List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-[var(--bg-surface)] border-2 border-dashed border-[var(--border-divider)] p-10 text-center space-y-2">
            <p className="text-base font-black uppercase text-[var(--text-primary)]">
              No Completed Orders in This Filter
            </p>
            <button
              type="button"
              onClick={() => setFilterTab("ALL")}
              className="px-5 py-2 rounded-full bg-[var(--btn-primary-default)] text-[var(--text-inverse)] font-black text-xs uppercase cursor-pointer"
            >
              Show All Completed Orders
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredOrders.map((order) => {
              const isAlreadyRated = order.rating > 0;
              const selectedStar = selectedStarsMap[order.order_id] || 0;
              const hoveredStar = hoveredStarsMap[order.order_id] || 0;
              const activeDisplayStar = isAlreadyRated
                ? order.rating
                : hoveredStar || selectedStar;

              return (
                <div
                  key={order.order_id}
                  className="bg-[var(--bg-surface)] border-2 border-[var(--border-light)] hover:border-[var(--border-divider)] p-4 sm:p-5 shadow-[var(--shadow-sm)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Brief Order Summary (Only essential info for identifying the order) */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-0.5 rounded-full bg-[var(--bg-dark)] text-[var(--text-inverse)] font-black text-xs">
                        #ORD-{order.order_id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--status-success)] border border-[var(--status-success)] text-[11px] font-black uppercase">
                        COMPLETED
                      </span>
                      {order.updated_at && (
                        <span className="text-xs font-bold text-[var(--text-muted)] inline-flex items-center gap-1">
                          <Clock size={12} />
                          {order.updated_at}
                        </span>
                      )}
                      <span className="text-sm font-black text-[var(--color-price)]">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] flex items-start gap-1.5 pt-1">
                        <Utensils
                          size={14}
                          className="text-[var(--btn-primary-default)] shrink-0 mt-0.5"
                        />
                        <div className="space-y-0.5">
                          {order.items.map((item) => (
                            <div key={item.order_detail_id}>
                              {item.quantity}x{" "}
                              {item.product_name || item.combo_name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 1-5 Star Rating Action Area */}
                  <div className="pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-light)] flex flex-wrap items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starValue) => {
                        const isFilled = starValue <= activeDisplayStar;
                        return (
                          <button
                            key={starValue}
                            type="button"
                            disabled={isAlreadyRated}
                            onClick={() =>
                              handleSelectStar(order.order_id, starValue)
                            }
                            onMouseEnter={() =>
                              !isAlreadyRated &&
                              handleHoverStar(order.order_id, starValue)
                            }
                            onMouseLeave={() =>
                              !isAlreadyRated &&
                              handleHoverStar(order.order_id, 0)
                            }
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${isAlreadyRated
                              ? "cursor-default bg-[var(--bg-main)] border-[var(--border-divider)]"
                              : "cursor-pointer bg-[var(--bg-main)] hover:bg-[var(--bg-hero)] border-[var(--border-divider)] hover:border-[var(--btn-secondary-default)]"
                              }`}
                            title={`${starValue} Star${starValue > 1 ? "s" : ""}`}
                          >
                            <Star
                              size={18}
                              fill={
                                isFilled
                                  ? "var(--color-rating-star)"
                                  : "transparent"
                              }
                              className={
                                isFilled
                                  ? "text-[var(--color-rating-star)]"
                                  : "text-[var(--text-muted)]"
                              }
                            />
                          </button>
                        );
                      })}
                    </div>

                    {isAlreadyRated ? (
                      <span className="px-4 py-2 rounded-full bg-[var(--bg-subtle)] text-[var(--status-success)] border border-[var(--status-success)] font-black text-xs uppercase inline-flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        Rated ({order.rating}/5)
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!selectedStar}
                        onClick={() => handleSubmitRating(order.order_id)}
                        className={`px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider transition-all ${selectedStar
                          ? "bg-[var(--btn-primary-default)] hover:bg-[var(--btn-primary-hover)] text-[var(--text-inverse)] shadow-[var(--shadow-sm)] cursor-pointer"
                          : "bg-[var(--btn-primary-disabled)] text-[var(--text-inverse)] cursor-not-allowed"
                          }`}
                      >
                        {selectedStar
                          ? `Submit (${selectedStar}/5)`
                          : "Select 1-5 Stars"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

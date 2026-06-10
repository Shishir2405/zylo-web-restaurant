"use client";

import DashboardShell from "@/components/dashboardShell";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import { IRestaurant } from "@/api/types/restaurant";
import { useEffect, useMemo, useState } from "react";
import { IOrder, IOrderDelivery, IOrderStatus } from "@/api/types/orders";
import { getOrderDelivery, getOrderList, updateOrderStatus } from "@/api/order";
import type { PaginationMeta } from "@/api/types/basic";
import { useRouter } from "next/navigation";
import { formatAmount } from "@/utils/helpers";
import toast from "react-hot-toast";
import FullScreenLoader from "@/components/loader/fullScreenLoader";
import { setRecentOrders } from "@/redux/reducers/restaurant";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Bike,
  KeyRound,
  Inbox,
} from "lucide-react";

const ACTIVE_STATUSES: IOrderStatus[] = [
  "Accepted",
  "Processing",
  "Shipped",
];

const PAGE_SIZE = 20;

const mergeUniqueById = <T extends { id: string }>(prev: T[], next: T[]): T[] => {
  const seen = new Set(prev.map((o) => o.id));
  const additions = next.filter((o) => !seen.has(o.id));
  return [...prev, ...additions];
};

export default function Orders() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails,
  );
  const recentOrders: IOrder[] =
    useAppSelector((state) => state.restaurant?.recentOrders) || [];
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderList, setOrderList] = useState<IOrder[]>(recentOrders);
  const [otpMap, setOtpMap] = useState<Record<string, IOrderDelivery>>({});
  const [query, setQuery] = useState("");
  const [pageMeta, setPageMeta] = useState<PaginationMeta | null>(null);

  const fetchPage = async (pageNumber: number, append: boolean) => {
    if (!restaurantRedux?.id) return;
    const response = await getOrderList(restaurantRedux.id, {
      pageNumber,
      pageSize: PAGE_SIZE,
    });
    if (response?.remote !== "success") return;

    const list: IOrder[] = (response as any).data?.data ?? [];
    const meta: PaginationMeta | undefined = (response as any).pagination;
    if (meta) setPageMeta(meta);

    const merged = append
      ? mergeUniqueById(orderList, list)
      : list;
    dispatch(setRecentOrders(merged));
    setOrderList(merged);

    // Re-derive OTP map for whichever active orders are now in view
    // (parallel, best-effort).
    const active = merged.filter((o) =>
      ACTIVE_STATUSES.includes(o.orderStatus),
    );
    const missing = active.filter((o) => !otpMap[o.id]);
    if (missing.length > 0) {
      const results = await Promise.allSettled(
        missing.map((o) => getOrderDelivery(o.id)),
      );
      const next: Record<string, IOrderDelivery> = { ...otpMap };
      results.forEach((r, i) => {
        if (r.status === "fulfilled" && (r.value as any)?.remote === "success") {
          const d = (r.value as any).data?.data ?? (r.value as any).data;
          if (d) next[missing[i].id] = d as IOrderDelivery;
        }
      });
      setOtpMap(next);
    }
  };

  const handleGetOrderList = () => fetchPage(1, false);

  const handleLoadMore = async () => {
    if (!pageMeta || loadingMore) return;
    if (pageMeta.currentPage >= pageMeta.totalPages) return;
    setLoadingMore(true);
    try {
      await fetchPage(pageMeta.currentPage + 1, true);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleQuickStatus = async (
    e: React.MouseEvent,
    orderId: string,
    status: IOrderStatus,
  ) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await updateOrderStatus(orderId, { status });
      if (response?.remote === "success") {
        toast.success(`Order ${status.toLowerCase()}.`);
        await handleGetOrderList();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (orderList.length === 0) setLoading(true);
      try {
        await handleGetOrderList();
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantRedux?.id]);

  const newOrders = useMemo(
    () => orderList.filter((o) => !o.orderRead),
    [orderList],
  );
  const filteredRecent = useMemo(() => {
    const past = orderList.filter((o) => o.orderRead);
    const q = query.trim().toLowerCase();
    if (!q) return past;
    return past.filter((o) =>
      [o.orderNumber, o.orderedBy, o.orderStatus]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q)),
    );
  }, [orderList, query]);

  return (
    <DashboardShell active="orders" title="Orders">
      {loading && <FullScreenLoader />}

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h2 className="zy-section-title" style={{ flex: 1, minWidth: 200 }}>
          Orders
        </h2>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "var(--surface-1)",
            border: "1px solid var(--zylo-border)",
            borderRadius: 12,
            minWidth: 280,
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders by number, customer, status"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: 13,
              color: "var(--text-primary)",
            }}
          />
        </div>
        <button
          onClick={() => handleGetOrderList()}
          className="zy-btn-secondary"
          style={{ padding: "8px 14px" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* New orders */}
      <section style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Inbox size={16} color="var(--gold-dark)" />
          <h3
            className="font-syne"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            New Orders
          </h3>
          {newOrders.length > 0 && (
            <span className="zy-badge zy-badge-gold">
              {newOrders.length} pending
            </span>
          )}
        </div>

        {newOrders.length === 0 ? (
          <div
            className="zy-card"
            style={{
              padding: 32,
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <Inbox
              size={26}
              color="var(--text-disabled)"
              style={{ margin: "0 auto 6px" }}
            />
            <p style={{ fontSize: 13 }}>No new orders right now.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 14,
            }}
          >
            {newOrders.map((order, index) => (
              <div
                key={order.id}
                onClick={() => router.push(`/orders/${order.id}`)}
                className="zy-card"
                style={{
                  padding: 16,
                  cursor: "pointer",
                  transition: "var(--transition)",
                  animation: "fadeUp 0.4s ease both",
                  animationDelay: `${index * 40}ms`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "var(--shadow-card)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-muted)",
                      }}
                    >
                      {order.orderNumber ||
                        `ORD-${order.id.slice(0, 6)?.toUpperCase()}`}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {order.orderedBy}
                    </div>
                  </div>
                  <span className="zy-badge zy-badge-gold">
                    <Clock size={10} /> Pending
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                  }}
                >
                  {order.shippingItems?.slice(0, 3).map((it, i) => (
                    <div key={i}>
                      {it.quantity}× {it.productName}
                    </div>
                  ))}
                  {order.shippingItems?.length > 3 && (
                    <div style={{ color: "var(--text-muted)" }}>
                      +{order.shippingItems.length - 3} more
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    borderTop: "1px solid var(--zylo-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "var(--gold-dark)",
                      fontFamily: "var(--font-syne), system-ui",
                    }}
                  >
                    ${formatAmount(order.total)}
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={(e) =>
                        handleQuickStatus(e, order.id, "Declined")
                      }
                      className="zy-btn-secondary"
                      style={{ padding: "6px 12px", fontSize: 12 }}
                    >
                      <XCircle size={12} /> Decline
                    </button>
                    <button
                      onClick={(e) =>
                        handleQuickStatus(e, order.id, "Accepted")
                      }
                      className="zy-btn-primary"
                      style={{ padding: "6px 14px", fontSize: 12 }}
                    >
                      <CheckCircle2 size={12} /> Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent orders table */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <ShoppingBag size={16} color="var(--text-muted)" />
          <h3
            className="font-syne"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Recent Orders
          </h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {filteredRecent.length} shown
          </span>
        </div>

        <div
          className="zy-card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.2fr 1.4fr 1.6fr 1fr 1fr 1.4fr 60px",
              padding: "12px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--zylo-border)",
            }}
          >
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Pickup OTP</span>
            <span></span>
          </div>

          {filteredRecent.length === 0 ? (
            <div
              style={{
                padding: 36,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              No recent orders.
            </div>
          ) : (
            filteredRecent.map((order, idx) => {
              const delivery = otpMap[order.id];
              const isActive = ACTIVE_STATUSES.includes(order.orderStatus);
              const otp = delivery?.pickupOtp;
              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.2fr 1.4fr 1.6fr 1fr 1fr 1.4fr 60px",
                    padding: "14px 16px",
                    fontSize: 13.5,
                    color: "var(--text-secondary)",
                    borderBottom:
                      idx === filteredRecent.length - 1
                        ? "none"
                        : "1px solid var(--zylo-border)",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    alignItems: "center",
                    animation: "fadeUp 0.3s ease both",
                    animationDelay: `${Math.min(idx, 8) * 30}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--surface-3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {order.orderNumber ||
                      `ORD-${order.id.slice(0, 6)?.toUpperCase()}`}
                  </span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.orderedBy}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.shippingItems
                      ?.map((i) => `${i.quantity}× ${i.productName}`)
                      .join(", ")}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: "var(--gold-dark)",
                      fontFamily: "var(--font-syne), system-ui",
                    }}
                  >
                    ${formatAmount(order.total)}
                  </span>
                  <span>
                    <StatusPill status={order.orderStatus} />
                  </span>
                  <span>
                    {isActive && otp ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          borderRadius: 8,
                          background: "var(--gold-bg)",
                          border: "1px solid var(--gold-border)",
                          fontFamily: "var(--font-syne), system-ui",
                          fontSize: 16,
                          fontWeight: 800,
                          letterSpacing: "0.18em",
                          color: "var(--gold-dark)",
                        }}
                      >
                        <KeyRound size={12} />
                        {otp}
                      </span>
                    ) : isActive ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        <Bike size={12} /> Awaiting rider…
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-disabled)" }}>—</span>
                    )}
                  </span>
                  <span
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <ChevronRight
                      size={16}
                      color="var(--text-disabled)"
                    />
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination footer — only renders when the backend reports more
            pages exist. Hidden during text search to avoid the misleading
            scenario where "Load more" hides items behind a stale filter. */}
        {pageMeta && pageMeta.totalPages > 1 && !query && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 16,
              fontSize: 12,
              color: "var(--text-muted)",
            }}
          >
            <span>
              Showing {orderList.filter((o) => o.orderRead).length} of{" "}
              {pageMeta.totalCount}
            </span>
            {pageMeta.currentPage < pageMeta.totalPages && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="zy-btn-secondary"
                style={{
                  padding: "8px 14px",
                  opacity: loadingMore ? 0.6 : 1,
                  cursor: loadingMore ? "not-allowed" : "pointer",
                }}
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function StatusPill({ status }: { status: IOrderStatus }) {
  const map: Record<IOrderStatus, { cls: string; label: string }> = {
    Pending: { cls: "zy-badge zy-badge-gold", label: "Pending" },
    Accepted: { cls: "zy-badge zy-badge-info", label: "Accepted" },
    Processing: { cls: "zy-badge zy-badge-info", label: "Processing" },
    Shipped: { cls: "zy-badge zy-badge-info", label: "Out for delivery" },
    Delivered: { cls: "zy-badge zy-badge-success", label: "Delivered" },
    Declined: { cls: "zy-badge zy-badge-error", label: "Declined" },
    Cancelled: { cls: "zy-badge zy-badge-error", label: "Cancelled" },
  };
  const m = map[status] ?? map.Pending;
  return <span className={m.cls}>{m.label}</span>;
}

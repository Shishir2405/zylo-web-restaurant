"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DashboardShell from "@/components/dashboardShell";
import {
  Circle,
  ChevronDown,
  Phone,
  Check,
  Lightbulb,
  Home as HomeIcon,
  UtensilsCrossed,
} from "lucide-react";
import { IRestaurant } from "@/api/types/restaurant";
import { useAppSelector } from "@/hooks/use-rtk";
import {
  getOrderDelivery,
  getOrderDetails,
  getOrderList,
  updateOrderStatus,
} from "@/api/order";
import { IOrder, IOrderDelivery, IOrderStatus } from "@/api/types/orders";
import { formatAddress, formatAmount } from "@/utils/helpers";
import LeafletMap from "@/components/leaflet-map";
import TrackingLeafletMap from "@/components/leaflet-map/trackingLocation";
import toast from "react-hot-toast";
import FullScreenLoader from "@/components/loader/fullScreenLoader";

export default function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const [status, setStatus] = useState<IOrderStatus>("Processing");
  const [isAccepted, setIsAccepted] = useState(false);
  const [orderDetails, setOrderDetails] = useState<IOrder>();
  const [delivery, setDelivery] = useState<IOrderDelivery | null>(null);
  const { id } = React.use(params);
  const [loading, setloading] = useState(false);

  const handleGetOrderDetails = async () => {
    try {
      if (!id) {
        return;
      }
      setloading(true);
      const response = await getOrderDetails(id);
      console.log(
        "✅ API Payload [handleGetOrderDetails]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        setOrderDetails(response.data.data);
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  const handleGetDelivery = async () => {
    if (!id) return;
    const response = await getOrderDelivery(id);
    if (response?.remote === "success") {
      const payload: any = response.data;
      setDelivery((payload?.data ?? payload) || null);
    } else {
      // 4xx is fine — delivery may not exist yet for orders pre-feature.
      setDelivery(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: IOrderStatus) => {
    try {
      if (!restaurantRedux.id) {
        return;
      }
      setloading(true);
      const response = await updateOrderStatus(orderId, { status });
      console.log(
        "✅ API Payload [handleUpdateStatus]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        await handleGetOrderDetails();
        toast.success("Order status updated successfully.");
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    handleGetOrderDetails();
    handleGetDelivery();

    // Live SignalR push: when a driver accepts our order, the server fires
    // PartnerAssigned to this restaurant user with the pickup OTP. We just
    // re-fetch so the card renders with the latest state.
    let mounted = true;
    (async () => {
      const { locationHub } = await import("@/api/signalr/locationHub");
      if (!mounted) return;
      await locationHub.connect();
      locationHub.onPartnerAssigned((data) => {
        if (data.orderId === id) handleGetDelivery();
      });
    })();

    // 60s safety net in case the websocket dropped silently. Down from 10s
    // since we expect SignalR to push the moment something changes.
    const t = setInterval(handleGetDelivery, 60_000);

    return () => {
      mounted = false;
      clearInterval(t);
      // Best-effort: tear down the listener (not the connection — the page
      // could be revisited).
      import("@/api/signalr/locationHub").then(({ locationHub }) => {
        locationHub.offPartnerAssigned();
      });
    };
  }, [id]);

  return (
    <DashboardShell
      active="orders"
      title="Order"
      subtitle={
        orderDetails?.orderNumber ||
        (orderDetails?.id
          ? `ORD-${orderDetails.id.slice(0, 6)?.toUpperCase()}`
          : undefined)
      }
    >
      {loading && <FullScreenLoader />}

      <div>
        <div>
          <div className="flex items-center mb-4">
            <Circle className="w-5 h-5 text-[var(--gold)] mr-2" />
            <span className="font-syne text-base font-bold text-[var(--text-primary)]">
              {orderDetails?.orderNumber ||
                `ORD-${orderDetails?.id?.slice(0, 6)?.toUpperCase()}`}
            </span>
          </div>

          {/* Pickup OTP card — shown to the restaurant until the partner has
              verified pickup. The partner reads this aloud (or sees it in
              the customer/delivery confirmation) and enters it on their phone. */}
          {delivery &&
            delivery.status !== "PickedUp" &&
            delivery.status !== "Delivered" &&
            delivery.status !== "Cancelled" && (
              <div
                style={{
                  marginBottom: 24,
                  padding: 24,
                  borderRadius: 20,
                  background:
                    "linear-gradient(135deg, #fff8e6 0%, #fff3d0 100%)",
                  border: "2px solid var(--gold)",
                  boxShadow:
                    "0 12px 40px rgba(212,132,10,0.18), 0 0 0 6px rgba(212,132,10,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  flexWrap: "wrap",
                  animation: "fadeUp 0.4s ease both",
                }}
              >
                <div style={{ flex: 1, minWidth: 220 }}>
                  <span
                    className="zy-badge zy-badge-gold"
                    style={{ marginBottom: 10 }}
                  >
                    Share with rider
                  </span>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--gold-dark)",
                      marginTop: 8,
                    }}
                  >
                    Pickup OTP
                  </p>
                  {delivery.pickupOtp ? (
                    <p
                      className="font-syne animate-glow"
                      style={{
                        marginTop: 8,
                        fontSize: 56,
                        fontWeight: 800,
                        letterSpacing: "0.4em",
                        color: "var(--text-primary)",
                        lineHeight: 1,
                        textShadow: "0 2px 12px rgba(212,132,10,0.25)",
                        padding: "8px 14px",
                        display: "inline-block",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.55)",
                        border: "1px dashed var(--gold)",
                      }}
                    >
                      {delivery.pickupOtp}
                    </p>
                  ) : (
                    <p
                      style={{
                        marginTop: 8,
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      Generating OTP…
                    </p>
                  )}
                  <p
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: "var(--gold-dark)",
                      fontWeight: 600,
                    }}
                  >
                    Read this code aloud to the delivery rider so they can
                    confirm pickup.
                  </p>
                </div>
                <div style={{ textAlign: "right", minWidth: 160 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Rider
                  </p>
                  <p
                    style={{
                      marginTop: 4,
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {delivery.partnerName ?? "Looking for rider…"}
                  </p>
                  {delivery.partnerPhone ? (
                    <a
                      href={`tel:${delivery.partnerPhone}`}
                      style={{
                        marginTop: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        color: "var(--gold-dark)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      <Phone size={13} />
                      {delivery.partnerPhone}
                    </a>
                  ) : null}
                </div>
              </div>
            )}

          {delivery?.status === "PickedUp" && (
            <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700 inline-flex items-center gap-2">
                <Check className="h-4 w-4" /> Picked up by{" "}
                {delivery.partnerName ?? "delivery partner"} — on the way to the
                customer.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700 mb-4">
              Order from {orderDetails?.orderedBy}
            </p>

            {orderDetails?.orderRead && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      handleUpdateStatus(id, e.target.value as IOrderStatus);
                    }}
                  >
                    <option value={"Processing"}>Food Processing</option>
                    <option value={"Shipped"}>Handover to delivery man</option>
                    <option value={"Delivered"}>Delivered</option>
                    {/* <option>Delivered</option> */}
                    {/* <option>Declined</option> */}
                    {/* <option>Cancelled</option> */}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#f8f9fc] rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Order Details</h2>
                <div className="mb-4">
                  {orderDetails?.shippingItems.map((order, index) => (
                    <p
                      key={"shippingItem" + index}
                      className="font-medium mb-1"
                    >
                      {`${order.quantity} x ${order.productName}`}
                    </p>
                  ))}

                  {orderDetails?.specialInstruction && (
                    <p className="text-sm text-gray-500 italic inline-flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-[var(--gold-dark)]" />
                      {orderDetails?.specialInstruction}
                    </p>
                  )}
                </div>

                {orderDetails?.orderStatus == "Pending" ? (
                  <div className="space-y-2">
                    <button
                      className="w-full py-3 bg-[#f8b133] text-white rounded-lg font-medium"
                      onClick={() => {
                        handleUpdateStatus(id, "Accepted");
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(id, "Declined");
                      }}
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderDetails?.orderStatus == "Accepted" ||
                      orderDetails?.orderStatus == "Processing" ||
                      (orderDetails?.orderStatus == "Shipped" && (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-[#f8b133] flex items-center justify-center mr-3">
                            <span className="text-xs text-white">✓</span>
                          </div>
                          <div>
                            <p className="font-medium">Order Accepted</p>
                            <p className="text-xs text-gray-500">10:45 AM</p>
                          </div>
                        </div>
                      ))}
                    {orderDetails?.orderStatus == "Processing" ||
                      (orderDetails?.orderStatus == "Shipped" && (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-[#f8b133] flex items-center justify-center mr-3">
                            <span className="text-xs text-white">✓</span>
                          </div>

                          <div>
                            <p className="font-medium">Food Preparing Done</p>
                            <p className="text-xs text-gray-500">10:55 AM</p>
                          </div>
                        </div>
                      ))}
                    {orderDetails?.orderStatus == "Shipped" ||
                      (orderDetails?.orderStatus == "Delivered" && (
                        <div className="flex items-center opacity-50">
                          <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                            <span className="text-xs text-gray-400"></span>
                          </div>
                          <div>
                            <p className="font-medium">Out for delivery</p>
                            <p className="text-xs text-gray-500">11:15 AM</p>
                          </div>
                        </div>
                      ))}
                    {orderDetails?.orderStatus == "Delivered" && (
                      <div className="flex items-center opacity-50">
                        <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-3">
                          <span className="text-xs text-gray-400"></span>
                        </div>
                        <div>
                          <p className="font-medium">Out for delivery</p>
                          <p className="text-xs text-gray-500">11:15 AM</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!loading && (
                <div className="bg-[#f8f9fc] rounded-lg p-6">
                  <h2 className="text-lg font-medium mb-4">Order Tracking</h2>
                  <div className="mb-4 rounded-lg overflow-hidden">
                    {/* <LeafletMap /> */}
                    <TrackingLeafletMap />
                    {/* <Image
                    src="/map.png"
                    alt="Map"
                    width={400}
                    height={200}
                    className="w-full h-[200px] object-cover"
                  /> */}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-[#f8b133] flex items-center justify-center mr-3">
                        <UtensilsCrossed className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {restaurantRedux?.restaurantName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatAddress(restaurantRedux?.address)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-[#f8b133] flex items-center justify-center mr-3">
                        <HomeIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {orderDetails?.shippingAddress.addressTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatAddress(orderDetails?.shippingAddress)}
                        </p>
                      </div>
                    </div>

                    {orderDetails?.orderStatus == "Accepted" && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Delivery Partner</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <Image
                                src="/delivery-partner.png"
                                alt="Delivery Partner"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <p className="font-medium">Siddhesh Garg</p>
                              <p className="text-xs text-gray-500">
                                4.5 rating
                              </p>
                            </div>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-[#f8b133] flex items-center justify-center">
                            <Phone className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 bg-[#f8f9fc] rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Bill Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-600">Total</span>
                  <span>$ {formatAmount(orderDetails?.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Tax</span>
                  <span>
                    ${" "}
                    {formatAmount(
                      orderDetails?.taxAmount ?? orderDetails?.flatTax ?? 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Delivery Fee</span>
                  <span>
                    $ {formatAmount(orderDetails?.deliveryFee ?? 0)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Bill</span>
                    <span>$ {formatAmount(orderDetails?.total)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Incl. of all taxes & charges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

"use client";

import Image from "next/image";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Package, DollarSign, Box } from "lucide-react";
import { useEffect, useState } from "react";
import {
  resetRestaurant,
  setCategories,
  setProductList,
  setRecentOrders,
  setRestaurantDetails,
} from "@/redux/reducers/restaurant";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import {
  getAllRestaurnatsProductsApi,
  getCategoriesApi,
} from "@/api/restaurant";
import { IRestaurant } from "@/api/types/restaurant";
import { getUserDetailsApi, getUserRestaurantDetailApi } from "@/api/user";
import { Product } from "@/api/types/product";
import { resetUser, setCurrentUser } from "@/redux/reducers/user";
import { debug } from "console";
import { formatAmount } from "@/utils/helpers";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { IOrder } from "@/api/types/orders";
import { getOrderList } from "@/api/order";
import FullScreenLoader from "@/components/loader/fullScreenLoader";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const productList: Product[] = useAppSelector(
    (state) => state.restaurant?.productList
  );
  const [loading, setloading] = useState(false);
  const recentOrders: IOrder[] =
    useAppSelector((state) => state.restaurant?.recentOrders) || [];
  const [orderList, setOrderList] = useState<IOrder[]>(recentOrders);

  const handleLogOut = () => {
    toast.error("Unauthorize");
    dispatch(resetUser());
    dispatch(resetRestaurant());

    Cookies.remove("token");
    window.location.reload();
  };
  const handleGetOrderList = async () => {
    try {
      if (!restaurantRedux.id) {
        return;
      }
      if (orderList?.length == 0) setloading(true);
      const response = await getOrderList(restaurantRedux.id);
      console.log(
        "✅ API Payload [handleGetOrderList]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        dispatch(setRecentOrders(response.data.data));
        setOrderList(response.data.data);
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  const handleGetCategories = async (resdata: IRestaurant) => {
    try {
      if (!resdata?.id) {
        toast.error("Please create restaurant first handleGetCategories.");
        router.push("/registration/info");
        return;
      }
      const response = await getCategoriesApi(resdata?.id);
      console.log(
        "✅ API Response [handleGetCategories]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        return response.data?.data;
        // dispatch(
        //   setRestaurantDetails({
        //     ...restaurantRedux,
        //     categoriesList: response.data?.data,
        //   })
        // );
      } else if (response.errors.status == 401) {
        handleLogOut();
      }
    } catch (error) {}
  };
  const handleGetProduct = async (resdata: IRestaurant) => {
    try {
      if (!resdata?.id) {
        toast.error("Please create restaurant first. handleGetProduct");
        router.push("/registration/info");
        return;
      }
      if (productList?.length == 0) setloading(true);
      const response = await getAllRestaurnatsProductsApi(resdata?.id);
      console.log(
        "✅ API Response [handleGetProduct]:",
        JSON.stringify(response, null, 2)
      );
      let categroies = await handleGetCategories(resdata);
      dispatch(setCategories(categroies || []));

      if (response?.remote === "success") {
        let products = response.data?.data;
        dispatch(setProductList(products));
      } else if (response.errors.status == 401) {
        handleLogOut();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const handleGetRestaurnatDetails = async () => {
    try {
      const response = await getUserRestaurantDetailApi();
      if (response?.remote === "success") {
        dispatch(setRestaurantDetails(response.data.data));
        handleGetProduct(response.data.data);
      } else if (response.errors.status == 401) {
        handleLogOut();
      } else {
        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        toast.error(
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        );
        router.push("/registration/info");
      }
    } catch (error) {
      console.log("�� API Response: handleGetRestaurnatDetails", error);
    }
  };
  const handleGetUserDetails = async () => {
    try {
      const response = await getUserDetailsApi();

      if (response?.remote === "success") {
        dispatch(setCurrentUser(response.data.data));
      } else if (response.errors.status == 401) {
        handleLogOut();
      }
    } catch (error) {
      console.log("�� API Response: handleGetUserDetails", error);
    }
  };

  useEffect(() => {
    handleGetOrderList();
    handleGetUserDetails();
    handleGetRestaurnatDetails();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {loading && <FullScreenLoader />}
      <Sidebar active="dashboard" />

      <div className="flex-1">
        <Header title="Dashboard" />

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4 flex items-center">
              <div className="w-14 h-14 rounded-full bg-[#E6F2F2] flex items-center justify-center mr-4">
                <Box className="w-6 h-6 text-[#65B0B0]" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Orders</div>
                <div className="text-2xl font-bold">{orderList?.length}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 flex items-center">
              <div className="w-14 h-14 rounded-full bg-[#FFF8E7] flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-[#f8b133]" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Products</div>
                <div className="text-2xl font-bold">
                  {productList?.length || 0}{" "}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 flex items-center">
              <div className="w-14 h-14 rounded-full bg-[#E6F2F2] flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-[#65B0B0]" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold">$0</div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Recent Order</h2>
            {orderList.length == 0 ? (
              <div className="flex items-center justify-center py-10">
                <span className="text-gray-500 text-sm">
                  No recent orders found
                </span>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-gray-600">
                          Order ID
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600">
                          Customer
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600">
                          Menu
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600">
                          Total Payment
                        </th>
                        <th className="text-left p-4 font-medium text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    {/* {orderList.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 w-full border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <span className="text-gray-500 text-base font-medium">
                          No new orders found
                        </span>
                      </div>
                    )} */}
                    <tbody>
                      {orderList
                        ?.filter((item) => item.orderRead)
                        ?.map((order, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td
                              onClick={() => {
                                router.push(`/orders/${order.id}`);
                              }}
                              className="p-4 cursor-pointer hover:text-blue-600 hover:underline"
                            >
                              <p className="font-semibold text-gray-700">
                                ORD-{order.id.slice(0, 6).toUpperCase()}
                              </p>
                              {/* {order?.id} */}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#f8b133] bg-opacity-30 flex items-center justify-center mr-3">
                                  <span className="text-xs text-[#f8b133]">
                                    EJ
                                  </span>
                                </div>
                                <span>{order?.orderedBy}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              {order?.shippingItems?.map((item, index) => (
                                <p
                                  key={index}
                                  className="text-sm text-gray-700 mb-1"
                                >
                                  • {item.productName} ({item.quantity})
                                </p>
                              ))}
                            </td>
                            <td className="p-4">
                              $
                              {formatAmount(
                                order?.shippingItems?.reduce(
                                  (acc, item) =>
                                    acc + item.quantity * item.price,
                                  0
                                )
                              )}
                              {/* {formatAmount(order?.totalPayment || 0)} */}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  order?.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {order?.paymentStatus === "Paid"
                                  ? "Paid"
                                  : "Unpaid"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  order?.orderStatus === "Delivered"
                                    ? "bg-green-100 text-green-600"
                                    : order?.orderStatus === "Processing"
                                    ? "bg-purple-100 text-purple-600"
                                    : order?.orderStatus === "Pending"
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {order?.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Recent Products</h2>
            {productList?.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <span className="text-gray-500 text-sm">
                  No recent product found
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4">
                {productList?.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    {/* <div className="h-40 bg-[#e6f2f2] flex items-center justify-center"> */}
                    <div className="relative h-40 bg-gray-100 group">
                      <Image
                        src={product?.photos?.[0]?.url || "/noodles.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-center">
                        {product?.name}
                      </h3>
                      <div className="flex justify-center mt-1">
                        <span className="text-sm font-medium">
                          ${formatAmount(product?.productPrice)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        {product.foodType}
                      </div>
                      <div className="text-xs text-[#f8b133] text-center mt-1">
                        {product.productDescription}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { deleteProductApi, updateProductApi } from "@/api/others";
import {
  createProductApi,
  getAllRestaurnatsProductsApi,
} from "@/api/restaurant";
import { categoriesDataType, createProductPayload } from "@/api/types/category";
import { Product } from "@/api/types/product";
import { IRestaurant } from "@/api/types/restaurant";
import Header from "@/components/header";
import FileUpload from "@/components/input/singleupload";
import Sidebar from "@/components/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import { resetRestaurant, setProductList } from "@/redux/reducers/restaurant";
import { resetUser } from "@/redux/reducers/user";
import { formatAmount } from "@/utils/helpers";
import { Grid } from "@mui/material";
import Cookies from "js-cookie";
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Products() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const productList: Product[] = useAppSelector(
    (state) => state.restaurant?.productList
  );
  const categoriesList: categoriesDataType[] = useAppSelector(
    (state) => state.restaurant?.categoriesList
  );
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setloading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [expandedDesc, setExpandedDesc] = useState<any>({});

  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const toggleDescription = (id: any) => {
    setExpandedDesc((prev: any) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGetProduct = async () => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }

      if (productList?.length == 0) setloading(true);

      const response = await getAllRestaurnatsProductsApi(restaurantRedux?.id);
      console.log(
        "✅ API Response [handleGetProduct]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        let products = response.data?.data;
        dispatch(setProductList(products));
      } else {
        if (response.errors.status == 401) {
          toast.error("Unauthorize");
          dispatch(resetUser());
          dispatch(resetRestaurant());
          Cookies.remove("token");
          window.location.reload();
          return;
        }

        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        // toast.error(
        //   typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        // );
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };
  const handleDeleteProduct = async (id: string) => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      setloading(true);
      const response = await deleteProductApi(id);

      if (response?.remote === "success") {
        toast.success("Product deleted successfully.");
        await handleGetProduct();
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!showAddProductForm) {
      handleGetProduct();
    }
  }, [showAddProductForm]);

  useEffect(() => {
    setFilteredProducts(productList);
  }, [categoriesList, productList]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="products" />

      <div className="flex-1">
        <Header title="Categories" />

        <div className="p-6">
          {showAddProductForm ? (
            <AddProductForm
              onClose={() => {
                setShowAddProductForm(false);
                setEditProduct(null);
              }}
              productToEdit={editProduct}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Products</h2>
                <button
                  className="flex items-center px-4 py-2 bg-[#f8b133] text-white rounded-lg"
                  onClick={() => {
                    if (categoriesList.length === 0) {
                      toast.error("Please add a category first.");
                      router.push("/categories");
                      return;
                    }
                    setShowAddProductForm(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new product
                </button>
              </div>
              {categoriesList?.length > 0 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
                  {categoriesList.map((item) => {
                    const isSelected = selectedCategory === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`px-4 py-2 rounded-full shadow-sm border text-sm font-medium cursor-pointer transition whitespace-nowrap
            ${
              isSelected
                ? "bg-[#f8b133] text-white border-[#f8b133]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-[#f8b133] hover:text-white"
            }`}
                        onClick={() => setSelectedCategory(item.id)}
                      >
                        {item.categoryName}
                      </div>
                    );
                  })}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                  <span className="text-gray-600 text-sm font-medium">
                    Loading products, please wait...
                  </span>
                </div>
              ) : (
                <>
                  {filteredProducts?.length === 0 ? (
                    <div className="flex items-center justify-center py-10">
                      <span className="text-gray-500 text-sm">
                        No product found.
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-4">
                      {filteredProducts?.map((product, index) => {
                        const isExpanded = expandedDesc[product?.id] || false;
                        const shortText =
                          product?.productDescription?.length > 80
                            ? product?.productDescription?.slice(0, 80) + "..."
                            : product?.productDescription;

                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden shadow-sm"
                          >
                            <div className="relative h-40 bg-gray-100 group">
                              <Image
                                src={
                                  product?.photos?.[0]?.url ||
                                  "/foodDefaultImage.png"
                                }
                                alt={"product?.name"}
                                fill
                                className="object-cover"
                              />

                              <div
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
            flex items-center justify-center gap-3 transition"
                              >
                                <button
                                  disabled={loading}
                                  onClick={() => {
                                    setEditProduct(product);
                                    setShowAddProductForm(true);
                                  }}
                                  className="bg-white px-3 py-1 rounded shadow"
                                >
                                  Edit
                                </button>

                                <button
                                  disabled={loading}
                                  onClick={() =>
                                    handleDeleteProduct(product?.id)
                                  }
                                  className="bg-red-500 text-white px-3 py-1 rounded shadow"
                                >
                                  Delete
                                </button>
                              </div>
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
                                {product?.foodType}
                              </div>

                              {/* ⭐ Read More / Read Less Here */}
                              <div className="text-xs text-[#f8b133] text-center mt-1">
                                {isExpanded
                                  ? product?.productDescription
                                  : shortText}

                                {product?.productDescription?.length > 80 && (
                                  <button
                                    className="text-[10px] text-blue-500 ml-1 underline"
                                    onClick={() =>
                                      toggleDescription(product?.id)
                                    }
                                  >
                                    {isExpanded ? "Read less" : "Read more"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AddProductForm({
  onClose,
  productToEdit,
}: {
  onClose: () => void;
  productToEdit?: Product | null;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const categoriesList: categoriesDataType[] = useAppSelector(
    (state) => state.restaurant?.categoriesList
  );
  const productList: Product[] = useAppSelector(
    (state) => state.restaurant?.productList
  );
  const [loading, setloading] = useState(false);

  const [category, setCategory] = useState(
    categoriesList?.length > 0 ? categoriesList[0].id : ""
  );
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [commission, setCommission] = useState("1");
  const [foodType, setFoodType] = useState<"veg" | "nonveg">("veg");
  const [file, setFile] = useState<File | null>(null);

  const handleLogOut = () => {
    dispatch(resetUser());
    dispatch(resetRestaurant());

    Cookies.remove("token");
    window.location.reload();
  };

  const handleCreateProduct = async () => {
    try {
      if (!category) {
        toast.error("Category is required.");
        return;
      }
      if (!productName) {
        toast.error("Product name is required.");
        return;
      }
      if (!description) {
        toast.error("Description is required.");
        return;
      }
      if (!price) {
        toast.error("Price is required.");
        return;
      }
      if (!commission) {
        toast.error("Commission is required.");
        return;
      }
      if (!foodType) {
        toast.error("Food type is required.");
        return;
      }
      if (!file) {
        toast.error("Images are required is required.");
        return;
      }
      setloading(true);
      let payload: createProductPayload = {
        name: productName,
        productDescription: description,
        productPrice: price,
        commission: commission,
        foodType: foodType,
        photos: file,
      };

      if (!category) {
        return;
      }
      const response = await createProductApi(category, payload);

      if (response?.remote === "success") {
        onClose();
      } else if (response.errors.status == 401) {
        toast.error("Unauthorize");
        handleLogOut();
      } else {
        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        toast.error(
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        );
      }
    } catch (error) {
      console.log("�� API Response: handleCreateProduct", error);
    } finally {
      setloading(false);
    }
  };
  const handleUpdateProduct = async (id: string) => {
    try {
      if (!id) {
        return;
      }
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      if (!category) {
        toast.error("Category is required.");
        return;
      }
      if (!productName) {
        toast.error("Product name is required.");
        return;
      }
      if (!description) {
        toast.error("Description is required.");
        return;
      }
      if (!price) {
        toast.error("Price is required.");
        return;
      }
      if (!commission) {
        toast.error("Commission is required.");
        return;
      }
      if (!foodType) {
        toast.error("Food type is required.");
        return;
      }
      if (!file) {
        toast.error("Images are required is required.");
        return;
      }
      let payload: createProductPayload = {
        name: productName,
        productDescription: description,
        productPrice: price,
        commission: commission,
        foodType: foodType,
        photos: file,
      };
      let data = new FormData();
      data.append("name", payload.name);
      data.append("productDescription", payload.productDescription);
      data.append("productPrice", payload.productPrice);
      data.append("commission", payload.commission);
      data.append("foodType", payload.foodType);

      data.append("photos", payload.photos);

      setloading(true);

      const response = await updateProductApi(id, data);

      if (response?.remote === "success") {
        toast.success("Product updated successfully");
        onClose();
      } else {
        if (response.errors.status == 401) {
          toast.error("Unauthorize");
          dispatch(resetUser());
          dispatch(resetRestaurant());
          Cookies.remove("token");
          window.location.reload();
          return;
        }
        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        toast.error(
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        );
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (productToEdit) {
      // setCategory(productToEdit.categoryId || "");
      setProductName(productToEdit.name || "");
      setDescription(productToEdit.productDescription || "");
      setPrice(productToEdit.productPrice?.toString() || "");
      // Don't set file here directly, keep it null until user uploads
    }
  }, [productToEdit]);
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center mb-6" onClick={onClose}>
          <ChevronLeft className="w-6 h-6 text-[#f8b133] mr-2" />

          <h2 className="text-lg font-medium">
            {productToEdit ? "Edit product" : "Add new product"}
          </h2>
        </button>
        <button
          className="flex items-center px-4 py-2 bg-[#f8b133] text-white rounded-lg"
          onClick={() => {
            router.push("/categories");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add more category
        </button>
      </div>

      <div className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose category*
          </label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoriesList?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.categoryName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product name
          </label>
          <input
            type="text"
            placeholder="Product name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product description
          </label>
          <textarea
            placeholder="Product description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product price
          </label>
          <input
            type="text"
            placeholder="Product price"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Commission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zylo commission
          </label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            >
              <option value="2">20%</option>
              <option value="1">15%</option>
              <option value="1">10%</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Food Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food type
          </label>
          <div className="space-y-2">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setFoodType("veg")}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${
                  foodType === "veg" ? "border-[#f8b133]" : "border-gray-300"
                }`}
              >
                {foodType === "veg" && (
                  <div className="w-3 h-3 rounded-full bg-[#f8b133]"></div>
                )}
              </div>
              <span className="text-sm">Veg</span>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setFoodType("nonveg")}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mr-2 ${
                  foodType === "nonveg" ? "border-[#f8b133]" : "border-gray-300"
                }`}
              >
                {foodType === "nonveg" && (
                  <div className="w-3 h-3 rounded-full bg-[#f8b133]"></div>
                )}
              </div>
              <span className="text-sm">Non Veg</span>
            </div>
          </div>
        </div>

        <Grid size={12}>
          <FileUpload
            label="Product images"
            file={file}
            setFile={(fileList) => {
              setFile(fileList);
            }}
          />
        </Grid>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 bg-[#f8b133] text-white rounded-lg flex items-center"
          // onClick={onClose}
          onClick={() => {
            if (productToEdit) {
              handleUpdateProduct(productToEdit.id);
            } else {
              handleCreateProduct();
            }
          }}
        >
          {loading ? "loading..." : productToEdit ? "Update" : "Save"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

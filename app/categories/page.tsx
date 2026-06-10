"use client";

import { deleteCategoryApi, updateCategoryApi } from "@/api/others";
import { createCategoryApi, getCategoriesApi } from "@/api/restaurant";
import {
  categoriesDataType,
  createCategoryPayload,
} from "@/api/types/category";
import { IRestaurant } from "@/api/types/restaurant";
import Header from "@/components/header";
import FileUpload from "@/components/input/singleupload";
import Sidebar from "@/components/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import { resetRestaurant, setCategories } from "@/redux/reducers/restaurant";
import { resetUser } from "@/redux/reducers/user";
import { Grid } from "@mui/material";
import Cookies from "js-cookie";
import { ChevronLeft, ChevronRight, Circle, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function Categories() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const categoriesList: categoriesDataType[] = useAppSelector(
    (state) => state.restaurant?.categoriesList
  );
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<categoriesDataType>();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setloading] = useState(false);

  const handleGetCategories = async () => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      if (categoriesList?.length == 0) setloading(true);

      const response = await getCategoriesApi(restaurantRedux?.id);
      console.log(
        "✅ API Response [handleGetCategories]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        dispatch(setCategories(response.data?.data));
      } else {
        dispatch(setCategories([]));
        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        toast.error(
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        );
        setTimeout(() => {
          setShowAddCategoryForm(true);
        }, 1000);
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };
  const handleDeleteCategories = async (id: string) => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      setloading(true);
      const response = await deleteCategoryApi(id);

      if (response?.remote === "success") {
        toast.success("Category deleted successfully.");
        await handleGetCategories();
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!showAddCategoryForm) {
      handleGetCategories();
    }
  }, [showAddCategoryForm]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="categories" />

      <div className="flex-1">
        <Header title="Categories" />

        <div className="p-6">
          {showAddCategoryForm ? (
            <AddCategoryForm
              id={selectedCategory?.id}
              onClose={() => setShowAddCategoryForm(false)}
              nameData={selectedCategory?.categoryName}
              discriptionData={selectedCategory?.categoryDescription}
              imageUrl={selectedCategory?.displayImage?.url}
            />
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Categories</h2>
                <button
                  className="flex items-center px-4 py-2 bg-[#f8b133] text-white rounded-lg"
                  onClick={() => setShowAddCategoryForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new category
                </button>
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                  <span className="text-gray-600 text-sm font-medium">
                    Loading categories, please wait...
                  </span>
                </div>
              ) : (
                <>
                  {categoriesList?.length === 0 ? (
                    <div className="flex items-center justify-center py-10">
                      <span className="text-gray-500 text-sm">
                        No Categories found. Please add a new category.
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-4">
                      {categoriesList?.map((category, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg overflow-hidden shadow-sm"
                        >
                          <div className="relative h-40 bg-gray-100 group">
                            <Image
                              src={
                                category?.displayImage?.url ||
                                "/foodDefaultImage.png"
                              }
                              alt={category?.categoryName || "Category image"}
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
                                  setSelectedCategory(category);
                                  setShowAddCategoryForm(true);
                                }}
                                className="bg-white px-3 py-1 rounded shadow"
                              >
                                Edit
                              </button>
                              <button
                                disabled={loading}
                                onClick={() => {
                                  handleDeleteCategories(category.id);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded shadow"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-center">
                              {category?.categoryName}
                            </h3>
                            {/* <div className="flex justify-center mt-1">
                                                  <span className="text-sm font-medium">
                                                    ${formatAmount(category?.productPrice)}
                                                  </span>
                                                </div> */}
                            {/* <div className="text-xs text-gray-500 text-center mt-1">
                                                  {category.foodType}
                                                </div> */}
                            <div className="text-xs text-[#f8b133] text-center mt-1">
                              {category.categoryDescription}
                            </div>
                          </div>
                        </div>
                      ))}
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

function AddCategoryForm({
  onClose,
  id,
  nameData,
  discriptionData,
  imageUrl,
}: {
  onClose: () => void;
  id?: string;
  nameData?: string;
  discriptionData?: string;
  imageUrl?: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const categoriesList: categoriesDataType[] = useAppSelector(
    (state) => state.restaurant?.categoriesList
  );
  const [name, setname] = useState(nameData || "");
  const [loading, setloading] = useState(false);
  const [description, setdescription] = useState(discriptionData || "");
  // const [image, setImage] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // const openFileDialog = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     setPreviewUrl(URL.createObjectURL(file));
  //   }
  // };

  // const removeImage = () => {
  //   setImage(null);
  //   setPreviewUrl(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""; // Reset input
  //   }
  // };
  const handleGetCategories = async () => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      if (categoriesList?.length == 0) setloading(true);

      const response = await getCategoriesApi(restaurantRedux?.id);
      console.log(
        "✅ API Response [handleGetCategories]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        dispatch(setCategories(response.data?.data));
      } else {
        dispatch(setCategories([]));
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
  const handleCreateCategory = async () => {
    try {
      if (!restaurantRedux.id) {
        toast.error("Please create restauant first.");
        return;
      }
      if (!name) {
        toast.error("Name is required.");
        return;
      }
      if (!description) {
        toast.error("Description is required.");
        return;
      }
      if (!file) {
        toast.error("Image is required.");
        return;
      }
      setloading(true);
      const formData = new FormData();
      formData.append("categoryName", name);
      formData.append("categoryDescription", description);
      if (file) {
        formData.append("displayImage", file);
      }
      console.log("Formdata for category creation", formData);

      const response = await createCategoryApi(restaurantRedux.id, formData);

      if (response?.remote === "success") {
        await handleGetCategories();
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
      console.log("�� API Response: handleSignin", error);
    } finally {
      setloading(false);
    }
  };
  const handleUpdateCategories = async (id: string) => {
    try {
      if (!restaurantRedux?.id) {
        toast.error("Please create restaurant first.");
        router.push("/registration/info");
        return;
      }
      if (!name) {
        toast.error("Name is required.");
        return;
      }
      if (!description) {
        toast.error("Description is required.");
        return;
      }
      setloading(true);

      const formData = new FormData();
      formData.append("categoryName", name);
      formData.append("categoryDescription", description);
      if (file) {
        formData.append("displayImage", file);
      }

      const response = await updateCategoryApi(id, formData);

      if (response?.remote === "success") {
        handleGetCategories();
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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <button className="flex items-center mb-6" onClick={onClose}>
        <ChevronLeft className="w-6 h-6 text-[#f8b133] mr-2" />
        <h2 className="text-lg font-medium">Add new Category</h2>
      </button>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category name
          </label>
          <input
            type="text"
            placeholder="Category name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category description
          </label>
          <textarea
            placeholder="Category description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            rows={3}
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          ></textarea>
        </div>

        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Category image
          </label> */}
          {/* <div className="flex space-x-3 items-center">
            {previewUrl && (
              <div className="relative w-20 h-20 bg-[#e6f2f2] rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-0 right-0 p-1 bg-white rounded-full shadow text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            {!previewUrl && (
              <div
                onClick={openFileDialog}
                className="w-20 h-20 border border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div> */}
          <Grid size={12}>
            <FileUpload
              // label="Upload Document"
              file={file}
              setFile={(fileList) => {
                setFile(fileList);
              }}
              url={imageUrl || ""}
            />
            {/* {touched.file && errors.file && (
                    <Typography color="error">{errors.file}</Typography>
                  )} */}
          </Grid>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-2 bg-[#f8b133] text-white rounded-lg flex items-center"
          // onClick={onClose}
          onClick={() => {
            if (id) {
              handleUpdateCategories(id);
            } else {
              handleCreateCategory();
            }
          }}
        >
          {loading ? "loading..." : "Save"}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

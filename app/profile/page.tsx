"use client";

import { getUserDetailsApi, updateUserProfileApi } from "@/api/user";
import Header from "@/components/header";
import ProfileUpload from "@/components/input/upload";
import PlacesAutocompleteInput from "@/components/PlacesAutocompleteInput";
import Sidebar from "@/components/sidebar";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import { resetRestaurant } from "@/redux/reducers/restaurant";
import { resetUser, setCurrentUser, User } from "@/redux/reducers/user";
import { convertToFormData } from "@/utils/helpers";
import { Box } from "@mui/material";
import { Eye, EyeOff, Lock, PenSquare, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userDetails: User = useAppSelector((state) => state.user.userDetails);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    userDetails?.profilePicture?.url || null
  );

  const handleUpdateProfie = async () => {
    if (loading) return;
    if (image == null || !image) {
      toast.error("Please select profile picture");
      return;
    }
    let payload = convertToFormData({ ...userDetails, profilePicture: image });

    try {
      const response = await updateUserProfileApi(payload);
      console.log(response);

      if (response?.remote === "success") {
        toast.success("Profile updated successfully");
        dispatch(setCurrentUser(response.data.data));
      } else {
        console.log("response.message", response);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  const handleLogOut = () => {
    toast.error("Unauthorize");
    dispatch(resetUser());
    dispatch(resetRestaurant());

    Cookies.remove("token");
    window.location.reload();
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
    handleGetUserDetails();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="profile" />

      <div className="flex-1">
        <Header title="My Profile" />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Account Information</h2>
            <div className="flex space-x-2">
              <button
                className="flex items-center px-3 py-2 bg-green-100 text-green-600 rounded-md"
                onClick={() => setShowChangePasswordModal(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>
              <button
                onClick={() => {
                  router.push("/registration/info");
                }}
                className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-600 rounded-md"
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Edit Restaurant
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-start mb-6">
              <ProfileUpload
                setImage={setImage}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="name"
                  value={
                    userDetails.firstName && userDetails?.lastName
                      ? userDetails.firstName + " " + userDetails?.lastName
                      : userDetails.firstName
                  }
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userDetails.userName}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number
                </label>
                <div className="flex">
                  <div className="flex items-center border border-gray-300 rounded-lg px-3 mr-1">
                    <span>+89</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    defaultValue={userDetails.phoneNumber}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value="•••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    readOnly
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div> */}

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    handleUpdateProfie();
                  }}
                  className="px-6 py-2 bg-[#f8b133] text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400"
              onClick={() => setShowChangePasswordModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-medium mb-6">Change Password</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value="•••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-[#f8b133] text-white rounded-lg font-medium">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { IRestaurant } from "@/api/types/restaurant";
import { getUserRestaurantDetailApi } from "@/api/user";
import Logo from "@/components/logo";
import PlacesAutocomplete from "@/components/PlacesAutocompleteInput";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import {
  resetRestaurant,
  setRestaurantDetails,
} from "@/redux/reducers/restaurant";
import { resetUser } from "@/redux/reducers/user";
import { AlertCircle, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { IAddress } from "@/api/types/user";

type Restaurant = {
  id: string;
  restaurantName: string;
  restaurantOwner: string;
  restaurantPhoneNumber: string;
  restaurantEmail: string;
  restaurantRegistrationNumber: string;
  address: IAddress;
};

// Field-level errors. A field is in here only if the user touched + left
// it invalid, or hit Next Step on an invalid form.
type Errors = Partial<{
  restaurantName: string;
  restaurantOwner: string;
  restaurantPhoneNumber: string;
  restaurantEmail: string;
  streetAddress: string;
  city: string;
  country: string;
}>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9 ()-]{7,}$/;

function validate(r: Restaurant): Errors {
  const e: Errors = {};
  if (!r.restaurantName.trim()) e.restaurantName = "Restaurant name is required.";
  if (!r.restaurantOwner.trim()) e.restaurantOwner = "Owner name is required.";
  if (!r.restaurantPhoneNumber.trim())
    e.restaurantPhoneNumber = "Phone number is required.";
  else if (!PHONE_RE.test(r.restaurantPhoneNumber))
    e.restaurantPhoneNumber = "Enter a valid phone number (digits, spaces, +, -).";
  if (!r.restaurantEmail.trim()) e.restaurantEmail = "Email is required.";
  else if (!EMAIL_RE.test(r.restaurantEmail))
    e.restaurantEmail = "Enter a valid email address.";
  if (!(r.address.streetAddress ?? "").trim())
    e.streetAddress = "Pick a place from the suggestions or type the street.";
  if (!(r.address.city ?? "").trim()) e.city = "City is required.";
  if (!(r.address.country ?? "").trim()) e.country = "Country is required.";
  return e;
}

export default function RestaurantInfo() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const [restaurant, setRestaurant] = useState<Restaurant>({
    id: "",
    restaurantName: "",
    restaurantOwner: "",
    restaurantPhoneNumber: "",
    restaurantEmail: "",
    restaurantRegistrationNumber: "",
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      addressLink: "",
    },
  });
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  // Show errors for a field only after the user has left it (or Submit was hit)
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>(
    {}
  );

  const markTouched = (field: keyof Errors) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleLogOut = () => {
    toast.error("Unauthorize");
    dispatch(resetUser());
    dispatch(resetRestaurant());
    Cookies.remove("token");
    window.location.reload();
  };

  const handleGetRestaurnatDetails = async () => {
    try {
      const response = await getUserRestaurantDetailApi();
      if (response?.remote === "success") {
        dispatch(setRestaurantDetails(response.data.data));
      } else if (response.errors.status == 401) {
        handleLogOut();
      }
    } catch (error) {
      console.log("API Response: handleGetUserDetails", error);
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components || [];
    const getComponent = (type: string) =>
      addressComponents.find((comp) => comp.types.includes(type))?.long_name ||
      "";
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    const addressLink =
      lat && lng
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : "";

    setRestaurant((prev) => ({
      ...prev,
      address: {
        streetAddress: place.formatted_address || "",
        city: getComponent("locality"),
        state: getComponent("administrative_area_level_1"),
        zipcode: getComponent("postal_code"),
        country: getComponent("country"),
        addressLink,
      },
    }));
  };

  // Re-validate live whenever the user changes anything; that way the
  // error message disappears as soon as the field becomes valid.
  useEffect(() => {
    setErrors(validate(restaurant));
  }, [restaurant]);

  useEffect(() => {
    setRestaurant((prev) => ({
      ...prev,
      ...restaurantRedux,
    }));
    setInputValue(restaurantRedux?.address?.streetAddress || "");
  }, [restaurantRedux]);

  useEffect(() => {
    handleGetRestaurnatDetails();
  }, []);

  const handleNext = () => {
    const e = validate(restaurant);
    setErrors(e);
    setTouched({
      restaurantName: true,
      restaurantOwner: true,
      restaurantPhoneNumber: true,
      restaurantEmail: true,
      streetAddress: true,
      city: true,
      country: true,
    });
    if (Object.keys(e).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    dispatch(setRestaurantDetails({ ...restaurantRedux, ...restaurant }));
    router.push("/registration/document");
  };

  const fieldClass = (hasError: boolean) =>
    `w-full p-3 border rounded-lg focus:outline-none transition-colors ${
      hasError
        ? "border-red-400 focus:border-red-500 bg-red-50/40"
        : "border-gray-300 focus:border-[#f8b133]"
    }`;

  const ErrorLine = ({ msg }: { msg?: string }) =>
    msg ? (
      <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle className="w-3.5 h-3.5" />
        {msg}
      </div>
    ) : null;

  const setAddr = (patch: Partial<IAddress>) =>
    setRestaurant((r) => ({ ...r, address: { ...r.address, ...patch } }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <Logo size="small" />
          <h1 className="text-xl font-medium text-[#0a3158] ml-4">
            Restaurant registration
          </h1>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f8b133]">
            <Image
              src="/defaultImage.jpg"
              alt="User Avatar"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[175px] bg-white min-h-[calc(100vh-73px)] border-r">
          <div className="py-8 px-4">
            <div className="mb-8">
              <div className="text-sm text-gray-500 mb-1">Step 1</div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#f8b133] flex items-center justify-center text-white text-sm font-medium mr-2">
                  1
                </div>
                <div className="text-sm font-medium">Restaurant Info</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Step 2</div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium mr-2">
                  2
                </div>
                <div className="text-sm font-medium text-gray-500">
                  Restaurant Document
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Restaurant Info
            </h2>
            <div className="flex space-x-2">
              <Link
                href="/login"
                className="w-9 h-9 rounded-full border border-gray-200 grid place-items-center transition-colors hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-1">
              Give your restaurant details for registration
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Address fields are filled in by Google when you pick a place. You
              can edit any of them after.
            </p>

            <div className="space-y-5">
              {/* Restaurant name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant name
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Restaurant name"
                  className={fieldClass(
                    !!touched.restaurantName && !!errors.restaurantName
                  )}
                  value={restaurant.restaurantName}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      restaurantName: e.target.value,
                    })
                  }
                  onBlur={() => markTouched("restaurantName")}
                />
                <ErrorLine
                  msg={touched.restaurantName ? errors.restaurantName : undefined}
                />
              </div>

              {/* Owner name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant owner name
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Restaurant owner name"
                  className={fieldClass(
                    !!touched.restaurantOwner && !!errors.restaurantOwner
                  )}
                  value={restaurant.restaurantOwner}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      restaurantOwner: e.target.value,
                    })
                  }
                  onBlur={() => markTouched("restaurantOwner")}
                />
                <ErrorLine
                  msg={
                    touched.restaurantOwner ? errors.restaurantOwner : undefined
                  }
                />
              </div>

              {/* Address autocomplete */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant complete address
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <PlacesAutocomplete
                  onPlaceSelected={handlePlaceSelected}
                  setInputValue={setInputValue}
                  inputValue={inputValue}
                />
                <ErrorLine
                  msg={touched.streetAddress ? errors.streetAddress : undefined}
                />
              </div>

              {/* Parsed address fields — editable so the user can fix anything Google missed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    className={fieldClass(!!touched.city && !!errors.city)}
                    value={restaurant.address.city}
                    onChange={(e) => setAddr({ city: e.target.value })}
                    onBlur={() => markTouched("city")}
                  />
                  <ErrorLine msg={touched.city ? errors.city : undefined} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    State / Region
                    <span className="ml-1 text-gray-400 text-xs">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="State"
                    className={fieldClass(false)}
                    value={restaurant.address.state}
                    onChange={(e) => setAddr({ state: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Country"
                    className={fieldClass(!!touched.country && !!errors.country)}
                    value={restaurant.address.country}
                    onChange={(e) => setAddr({ country: e.target.value })}
                    onBlur={() => markTouched("country")}
                  />
                  <ErrorLine
                    msg={touched.country ? errors.country : undefined}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Zipcode / Postal code
                    <span className="ml-1 text-gray-400 text-xs">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Postal code"
                    className={fieldClass(false)}
                    value={restaurant.address.zipcode}
                    onChange={(e) => setAddr({ zipcode: e.target.value })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant phone number
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  className={fieldClass(
                    !!touched.restaurantPhoneNumber &&
                      !!errors.restaurantPhoneNumber
                  )}
                  value={restaurant.restaurantPhoneNumber}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      restaurantPhoneNumber: e.target.value,
                    })
                  }
                  onBlur={() => markTouched("restaurantPhoneNumber")}
                />
                <ErrorLine
                  msg={
                    touched.restaurantPhoneNumber
                      ? errors.restaurantPhoneNumber
                      : undefined
                  }
                />
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant email address
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="restaurant@example.com"
                  className={fieldClass(
                    !!touched.restaurantEmail && !!errors.restaurantEmail
                  )}
                  value={restaurant.restaurantEmail}
                  onChange={(e) =>
                    setRestaurant({
                      ...restaurant,
                      restaurantEmail: e.target.value,
                    })
                  }
                  onBlur={() => markTouched("restaurantEmail")}
                />
                <ErrorLine
                  msg={
                    touched.restaurantEmail ? errors.restaurantEmail : undefined
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-[#f8b133] text-white rounded-lg flex items-center font-medium transition-all hover:bg-[#e6a02a] hover:-translate-y-0.5 hover:shadow-md"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

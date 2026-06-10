"use client";
import { createRestaurantApi, updateRestaurantApi } from "@/api/restaurant";
import { CreateRestaurantPayload, IRestaurant } from "@/api/types/restaurant";
import Logo from "@/components/logo";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import {
  resetRestaurant,
  setRestaurantDetails,
} from "@/redux/reducers/restaurant";
import { resetUser } from "@/redux/reducers/user";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  ImageIcon,
  Replace,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const formatBytes = (n: number) => {
  if (!n) return "0 KB";
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

const isImage = (file: File | null) =>
  !!file && file.type.startsWith("image/");

const isPdf = (file: File | null) => !!file && file.type === "application/pdf";

/** Upload tile — handles empty state, image preview, and PDF preview. */
function UploadTile({
  id,
  label,
  hint,
  file,
  onPick,
  onClear,
  acceptImagesOnly = false,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  onPick: (f: File) => void;
  onClear: () => void;
  acceptImagesOnly?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // For images we generate an object URL; revoke it when the file changes
    // or the component unmounts to avoid leaking blob URLs.
    if (file && isImage(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  const handle = (f: File) => {
    if (f.size > MAX_BYTES) {
      toast.error(`${f.name} is larger than 5 MB`);
      return;
    }
    if (acceptImagesOnly && !f.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG/PNG)");
      return;
    }
    onPick(f);
  };

  const accept = acceptImagesOnly
    ? ".jpg,.jpeg,.png,.webp"
    : ".pdf,.jpg,.jpeg,.png";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{hint}</span>
      </div>

      {!file ? (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handle(f);
          }}
          className={`group block cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 ${
            dragOver
              ? "border-[#f8b133] bg-[#FFF8E7] scale-[1.01]"
              : "border-gray-200 bg-[#FAFAFA] hover:border-[#f8b133] hover:bg-[#FFF8E7]"
          }`}
        >
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#FFF8E7] text-[#f8b133] transition-transform duration-300 group-hover:-translate-y-0.5">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Click to upload or drag &amp; drop
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {acceptImagesOnly ? "JPG / PNG" : "PDF / JPG / PNG"} · up to 5 MB
            </span>
          </div>
          <input
            ref={inputRef}
            type="file"
            id={id}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handle(f);
            }}
          />
        </label>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Preview body */}
          {isImage(file) && previewUrl ? (
            <div className="relative bg-[#FAFAFA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={file.name}
                className="w-full h-44 object-cover"
              />
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-medium text-emerald-700 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Uploaded
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-5 bg-[#FAFAFA]">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-white border border-gray-200 text-[#f8b133]">
                {isPdf(file) ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {file.type || "file"} · {formatBytes(file.size)}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ready
              </span>
            </div>
          )}

          {/* Footer with file info + actions */}
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <div className="text-xs text-gray-500 truncate">
              {isImage(file) ? (
                <span className="truncate">{file.name}</span>
              ) : (
                <span>{formatBytes(file.size)}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Replace className="w-3.5 h-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            id={id}
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handle(f);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function RestaurantDocument() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const restaurantRedux: IRestaurant = useAppSelector(
    (state) => state.restaurant?.restaurantDetails
  );
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [restaurantFile, setRestaurantFile] = useState<File | null>(null);

  const handleCreateRestaurant = async () => {
    try {
      const addr = restaurantRedux.address;
      // The backend requires addressLink. It's normally set from the Google
      // Places suggestion (lat,lng), but if the user typed the address
      // manually we fall back to a maps search URL built from the address text.
      const addressLink =
        addr.addressLink ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [addr.streetAddress, addr.city, addr.state, addr.country]
            .filter(Boolean)
            .join(", ")
        )}`;

      const payload: CreateRestaurantPayload = {
        restaurantName: restaurantRedux.restaurantName,
        restaurantOwner: restaurantRedux.restaurantOwner,
        restaurantPhoneNumber: restaurantRedux.restaurantPhoneNumber,
        restaurantEmail: restaurantRedux.restaurantEmail,
        address: {
          streetAddress: addr.streetAddress,
          city: addr.city || "",
          state: addr.state || "",
          zipcode: addr.zipcode || "",
          country: addr.country || "",
          addressLink,
        },
        restaurantRegistrationNumber: registrationNumber,
        documents: licenseFile,
        displayImage: restaurantFile,
      };

      setloading(true);

      const response = restaurantRedux.id
        ? await updateRestaurantApi(payload, restaurantRedux.id)
        : await createRestaurantApi(payload);

      console.log(
        "[create-restaurant] full response:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        dispatch(
          setRestaurantDetails({
            ...restaurantRedux,
            restaurantRegistrationNumber: registrationNumber,
            documents: null,
          })
        );
        toast.success("Restaurant details saved successfully");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        if (response.errors.status == 401) {
          toast.error("Unauthorized");
          dispatch(resetUser());
          dispatch(resetRestaurant());
          Cookies.remove("token");
          window.location.reload();
          return;
        }

        // Pull a useful message out of whatever shape the backend sent.
        // ASP.NET validation 400s look like:
        //   { errors: { Field: ["msg"] }, title: "...", status: 400 }
        // Our own Fail() responses look like:
        //   { message: "...", success: false, data: null }
        const body = response?.errors?.errors as any;
        let msg: string | null = null;

        if (body?.message && typeof body.message === "string") {
          msg = body.message;
        } else if (body?.title && typeof body.title === "string") {
          // Validation error — append the first field-level error if any
          const first =
            body.errors && typeof body.errors === "object"
              ? Object.entries(body.errors)
                  .flatMap(([k, v]) =>
                    Array.isArray(v) ? v.map((m) => `${k}: ${m}`) : []
                  )
                  .slice(0, 3)
                  .join(" • ")
              : "";
          msg = first ? `${body.title} — ${first}` : body.title;
        } else if (typeof body === "string") {
          msg = body;
        }

        toast.error(msg || `Request failed (${response?.errors?.status ?? "?"})`);
      }
    } catch (error) {
      console.log("API Response: handleCreateRestaurant", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    setRegistrationNumber(restaurantRedux.restaurantRegistrationNumber);
    setLicenseFile(restaurantRedux.documents);
  }, []);

  const canSubmit =
    !!registrationNumber.trim() && !!restaurantFile && !!licenseFile;

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
        {/* Sidebar steps */}
        <div className="w-[200px] bg-white min-h-[calc(100vh-73px)] border-r">
          <div className="py-8 px-4">
            <Step number={1} label="Restaurant Info" done />
            <Step number={2} label="Restaurant Document" current />
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-700">
                Restaurant Document
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Upload your restaurant photo and the license document so we can
                verify and activate your account.
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/registration/info"
                className="w-9 h-9 rounded-full border border-gray-200 grid place-items-center transition-colors hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <h3 className="text-base font-medium mb-1">
              Upload your restaurant documents for verification
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Files are kept private and only shared with our verification team.
            </p>

            <div className="space-y-6">
              {/* Registration Number */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Restaurant registration number
                  </label>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. REG-92148-AB"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#f8b133] focus:ring-4 focus:ring-[#f8b133]/15"
                />
              </div>

              {/* Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <UploadTile
                  id="RestaurantImage-upload"
                  label="Restaurant photo"
                  hint="Shown on your profile"
                  file={restaurantFile}
                  onPick={setRestaurantFile}
                  onClear={() => setRestaurantFile(null)}
                  acceptImagesOnly
                />
                <UploadTile
                  id="license-upload"
                  label="Restaurant license"
                  hint="PDF or photo"
                  file={licenseFile}
                  onPick={setLicenseFile}
                  onClear={() => setLicenseFile(null)}
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-between mt-6">
            <Link
              href="/registration/info"
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 flex items-center transition-colors hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
            <button
              disabled={loading || !canSubmit}
              className={`px-5 py-2 rounded-lg flex items-center font-medium transition-all duration-200 ${
                loading || !canSubmit
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#f8b133] text-white hover:bg-[#e6a02a] hover:-translate-y-0.5 hover:shadow-md"
              }`}
              onClick={handleCreateRestaurant}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </span>
              ) : (
                <>
                  Submit for verification
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  label,
  done,
  current,
}: {
  number: number;
  label: string;
  done?: boolean;
  current?: boolean;
}) {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-left-2 duration-500">
      <div className="text-xs text-gray-500 mb-1">Step {number}</div>
      <div className="flex items-center">
        <div
          className={`w-7 h-7 rounded-full grid place-items-center text-xs font-semibold mr-2 transition-colors ${
            done
              ? "bg-emerald-500 text-white"
              : current
              ? "bg-[#f8b133] text-white ring-4 ring-[#f8b133]/20"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {done ? <CheckCircle2 className="w-4 h-4" /> : number}
        </div>
        <div
          className={`text-sm ${
            current ? "font-medium text-gray-800" : "text-gray-700"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

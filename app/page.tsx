"use client";
import { SignUpPayload } from "@/api/types/user";
import { signUpApi } from "@/api/user";
import { useAppDispatch, useAppSelector } from "@/hooks/use-rtk";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  console.log("state", state);

  const handleSignUp = async () => {
    try {
      const trimmedEmail = email?.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (name?.trim() == "") {
        toast.error("Name is required.");
        return;
      }
      if (email?.trim() == "") {
        toast.error("Email is required.");
        return;
      }
      if (!emailRegex.test(trimmedEmail)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
      const trimmedPhone = phone?.trim();
      const phoneRegex = /^[0-9]{10}$/;
      if (phone?.trim() == "") {
        toast.error("Mobile number is required.");
        return;
      }
      if (!phoneRegex.test(trimmedPhone)) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return false;
      }
      if (password?.trim() == "") {
        toast.error("Password is required");
        return;
      }
      if (password?.trim().length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
      }
      if (confPassword?.trim() == "") {
        toast.error("Confirm password is required");
        return;
      }
      if (password?.trim() != confPassword?.trim()) {
        toast.error("Password should match");
        return;
      }
      let payload: SignUpPayload;
      payload = {
        firstName: name,
        lastName: name,
        username: email,
        email: email,
        password: password,
        phoneNumber: phone,
        address: {
          streetAddress: "15 Jump Street",
          city: "Los Angeles",
          state: "California",
          zipcode: "22956",
          country: "United States",
          addressLink: "https://www.google.com/maps",
        },
      };
      console.log(
        "✅ API Payload [handleSignUp]:",
        JSON.stringify(payload, null, 2)
      );
      setloading(true);
      const response = await signUpApi(payload);
      console.log(
        "✅ API Response [handleSignUp]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        const token = response.data.token;

        toast.success("Registration successfully.");
        router.push("/login");

        console.log("handleSignUp success");
      } else {
        const errorMsg =
          response?.errors?.errors || "An unexpected error occurred";
        console.log(response.errors.status);

        // errorToast(
        //   typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
        // );
      }
    } catch (error) {
      // dispatch(storeLoading(false));
      console.log("�� API Response: handleSignUp", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with logo */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-white">
        <div className="max-w-[400px] flex flex-col items-center">
          <div className="flex items-center mb-4">
            <span className="text-[#0a3158] text-[120px] font-bold leading-none">
              Z
            </span>
            <span className="text-[#0a3158] text-[120px] font-bold leading-none -ml-4">
              y
            </span>
            <span className="text-[#0a3158] text-[120px] font-bold leading-none -ml-4">
              l
            </span>
            <div className="relative -ml-2">
              <div className="w-[80px] h-[80px] rounded-full bg-[#f8b133] flex items-center justify-center">
                <div className="w-[60px] h-[60px] rounded-full border-[6px] border-white flex items-center justify-center">
                  <div className="w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
                    <div className="w-[15px] h-[15px] rounded-full bg-[#f8b133]"></div>
                  </div>
                  <div className="absolute w-[10px] h-[2px] bg-white rotate-0 translate-x-[15px]"></div>
                  <div className="absolute w-[10px] h-[2px] bg-white rotate-72 translate-x-[15px]"></div>
                  <div className="absolute w-[10px] h-[2px] bg-white rotate-144 translate-x-[15px]"></div>
                  <div className="absolute w-[10px] h-[2px] bg-white rotate-216 translate-x-[15px]"></div>
                  <div className="absolute w-[10px] h-[2px] bg-white rotate-288 translate-x-[15px]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#0a3158] text-[50px] font-bold -mt-8 ml-auto">
            RIDE
          </div>
          <h2 className="text-3xl text-center text-[#0a3158] mt-4">
            Restaurant - Partner
          </h2>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8">Sign up</h1>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

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
                placeholder="Your mobile number"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={phone}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setphone(onlyDigits);
                }}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
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

            <div className="relative">
              <input
                type={showConfPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={confPassword}
                onChange={(e) => setconfPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfPassword(!showConfPassword)}
              >
                {showConfPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center bg-[#f8b133]">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <label className="ml-2 text-sm text-gray-500">
                By signing up, you agree to the{" "}
                <span className="text-[#f8b133]">Terms of service</span> and{" "}
                <span className="text-[#f8b133]">privacy policy</span>.
              </label>
            </div>
            {/* <Link href="/login"> */}
            <button
              disabled={loading}
              onClick={() => {
                handleSignUp();
              }}
              type="submit"
              className={`w-full p-3 rounded-lg font-medium mt-2 flex items-center justify-center transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-[#f8b133] text-white hover:opacity-90"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
            {/* </Link> */}
          </div>

          <div className="mt-6 text-center">
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition">
              <Image src="/google.png" alt="Google" width={20} height={20} />
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-[#f8b133] font-medium">
                Signin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { SignInPayload } from "@/api/types/user";
import { loginApi } from "@/api/user";
import { resetRestaurant } from "@/redux/reducers/restaurant";
import { resetUser } from "@/redux/reducers/user";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setemailOrPhone] = useState("");
  const [password, setpassword] = useState("");

  const handleSignin = async () => {
    try {
      if (emailOrPhone?.trim() == "") {
        toast.error("Email or phone is required.");
        return;
      }
      if (password?.trim() == "") {
        toast.error("Password is required");
        return;
      }
      let payload: SignInPayload;
      payload = {
        email: emailOrPhone,
        password: password,
      };
      console.log("✅ API Payload [Login]:", JSON.stringify(payload, null, 2));
      setloading(true);
      const response = await loginApi(payload);
      console.log(
        "✅ API Response [Login]:",
        JSON.stringify(response, null, 2)
      );

      if (response?.remote === "success") {
        const token = response.data.token;
        Cookies.set("token", token);

        toast.success("Login successfully.");
        router.push("/dashboard");

        console.log("login success");
      } else {
        const errorMsg =
          response?.errors?.errors?.message || "An unexpected error occurred";
        console.log(response.errors.status);

        toast.error(
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        );
      }
    } catch (error) {
      // dispatch(storeLoading(false));
      console.log("�� API Response: handleSignin", error);
    } finally {
      setloading(false);
    }
  };
  const handleLogOut = () => {
    dispatch(resetUser());
    dispatch(resetRestaurant());
    Cookies.remove("token");
  };

  useEffect(() => {
    handleLogOut();
  }, []);

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
          <h1 className="text-4xl font-bold mb-8">Welcome!</h1>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email " //or Phone Number
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={emailOrPhone}
                onChange={(e) => setemailOrPhone(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-red-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={loading}
              onClick={handleSignin}
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
                "Login"
              )}
            </button>
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
              Don't have an account?{" "}
              <Link href="/" className="text-[#f8b133] font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { IAddress } from "@/api/types/user";
import dayjs from "dayjs";
export const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (dayjs.isDayjs(value)) {
      formData.append(key, value.toISOString());
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      if (key === "email") {
        formData.append(key, String(value).toLowerCase());
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

export const formatAmount = (
  amount: number | string | undefined | null
): string => {
  if (amount === undefined || !amount) return "0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};
export function formatAddress(address?: IAddress | null): string {
  if (!address) return "Address not available";

  const { streetAddress, city, state, zipcode, country } = address;

  // Collect only valid parts
  const parts = [
    streetAddress?.trim(),
    city?.trim(),
    state?.trim(),
    zipcode?.trim(),
    country?.trim(),
  ].filter(Boolean); // removes null, undefined, and empty strings

  return parts.length > 0 ? parts.join(", ") : "Address not available";
}

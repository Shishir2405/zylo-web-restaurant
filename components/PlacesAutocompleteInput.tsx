"use client";

import { useEffect, useRef, useState } from "react";

export default function PlacesAutocomplete({
  inputValue,
  setInputValue,
  onPlaceSelected,
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        // componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const formatted = place.formatted_address || "";

      // ✅ Update input field with selected place
      setInputValue(formatted);
      onPlaceSelected(place);
    });
  }, []);

  return (
    <input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      className="border px-4 py-2 rounded w-full"
      placeholder="Enter your restaurant address"
    />
  );
}

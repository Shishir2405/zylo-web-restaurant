"use client";

import { useState } from "react";
import { Avatar, Box, IconButton, Skeleton } from "@mui/material";
import { PenSquare } from "lucide-react";

export default function ProfileUpload({
  imageUrl,
  setImageUrl,
  setImage,
  loading = false,
}: {
  loading?: boolean;
  imageUrl?: string | null;
  setImage: (file: File | null) => void;
  setImageUrl: (imageUrl: string | null) => void;
}) {
  // const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImageUrl(null);
  };

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          border: "1px solid var(--Outline, #E4E9ED)",
          borderRadius: "62px",
        }}
      >
        {loading ? (
          <Skeleton variant="circular" width={120} height={120} />
        ) : (
          <Avatar
            src={imageUrl || "/defaultImage.png"}
            sx={{ width: 120, height: 120 }}
          />
        )}

        {/* Action Buttons */}
        {!loading && (
          <Box
            sx={{
              position: "absolute",
              bottom: -9,
              left: "96%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 3,
              padding: "2px 6px",
            }}
          >
            {/* Upload Button */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" component="span" size="small">
                <div className="absolute top-0 left-0 w-6 h-6 bg-[#f8b133] rounded-full flex items-center justify-center">
                  <PenSquare className="w-3 h-3 text-white" />
                </div>
              </IconButton>
            </label>

            {/* Delete Button */}
            {imageUrl && (
              <IconButton
                color="primary"
                size="small"
                onClick={handleImageRemove}
              >
                {/* <SVG.ProfileUpdate /> */}
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

"use client";

import React, { useCallback, useState } from "react";
import { Box, Button, FormLabel, Typography, IconButton } from "@mui/material";
import Image from "next/image";

interface FileUploadProps {
  label?: string;
  accept?: string;
  setFile: (files: File | null) => void;
  file: File | null;
  url?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "Category image",
  accept = ".png, .jpg, .jpeg",
  setFile,
  file,
  url,
}) => {
  // const [, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(url || "");

  const updateFile = (newFile: File) => {
    if (newFile.type.startsWith("image/")) {
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) updateFile(droppedFile);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      updateFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Box>
      {label && (
        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </FormLabel>
      )}

      {/* Upload Box - Hide when preview is shown */}
      {!preview && (
        <Box
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            border: "2px dashed #CCDBEB",
            borderRadius: "8px",
            textAlign: "center",
            py: 4,
            px: 2,
            mb: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Drag and drop a file here
          </Typography>
          <Typography variant="body2" mb={2}>
            JPG, PNG files are supported
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{ textTransform: "capitalize" }}
          >
            Browse File
            <input
              hidden
              type="file"
              accept={accept}
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      )}

      {/* Image Preview */}
      {preview && (
        <Box
          sx={{
            position: "relative",
            width: 120,
            height: 120,
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Image
            src={preview}
            alt="preview"
            width={120}
            height={120}
            style={{ objectFit: "fill" }}
            className="w-full h-full object-cover"
          />
          <IconButton
            size="small"
            onClick={handleDelete}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
            className="absolute top-0 right-0 p-1 bg-white rounded-full shadow text-red-500 text-xs"
          >
            ✕
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;

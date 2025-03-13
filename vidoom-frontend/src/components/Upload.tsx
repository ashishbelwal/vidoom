import { Input } from "@heroui/react";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/mkv",
  "video/avi",
  "video/quicktime",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function Upload() {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);

    const selectedFiles = Array.from(event.target.files || []);

    const validFiles = selectedFiles.filter(
      (file) =>
        ALLOWED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length === 0) {
      setError(
        "Invalid file. Only MP4, WebM, Ogg, MKV, and QuickTime (MOV) are allowed. Max size: 50MB."
      );
      return;
    }

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("video", file)); // Use "video" to match backend

    try {
      const res = await axios.post<{ message: string; filePaths: string[] }>(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", res.data);
    } catch (error) {
      console.error("Upload error:", error);
      setError("File upload failed. Please try again.");
    }
  };

  return (
    <div className="w-[230px] h-full flex flex-col">
      <Input
        id="video-upload"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500 text-sm text-left mt-2">{error}</p>}
    </div>
  );
}

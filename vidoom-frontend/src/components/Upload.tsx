import { addToast, Input, Spinner } from "@heroui/react";
import { useRef, useState } from "react";
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

interface UploadProps {
  setSeed: (seed: number) => void;
}

const Upload = ({ setSeed }: UploadProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    const selectedFiles = Array.from(event.target.files || []);

    const validFiles = selectedFiles.filter(
      (file) =>
        ALLOWED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length === 0) {
      addToast({
        title: "Invalid file type",
        description: "Please upload a valid video file",
        color: "danger",
        shouldShowTimeoutProgress: true,
        classNames: {
          title: "text-left",
          base: "bg-[#000000] rounded-md",
          closeButton: "bg-[#000000]",
        },
      });
      return;
    }

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("video", file));
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
      addToast({
        title: "Upload successful",
        description: "Video uploaded successfully",
        color: "success",
        shouldShowTimeoutProgress: true,
        classNames: {
          title: "text-left",
          base: "bg-[#000000] rounded-md",
          closeButton: "bg-[#000000]",
        },
      });
      setSeed(Math.random());
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        title: "Upload failed",
        description: "File upload failed. Please try again.",
        color: "danger",
        shouldShowTimeoutProgress: true,
        classNames: {
          title: "text-left",
          base: "bg-[#000000] rounded-md",
          closeButton: "bg-[#000000]",
        },
      });
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-[230px] h-full flex flex-col">
      <div className="flex">
        <Input
          id="video-upload"
          type="file"
          multiple
          label="Upload Video"
          onChange={handleFileChange}
          disabled={isLoading}
          ref={inputRef}
        />
        {isLoading && (
          <div className="flex justify-center items-center ml-2">
            <Spinner size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;

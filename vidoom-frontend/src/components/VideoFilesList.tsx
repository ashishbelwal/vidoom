import { useEffect, useState, useRef } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface FileList {
  name: string;
  imageUrl: string;
  videoUrl: string;
}

interface SelectedVideo {
  video: string;
  videoName: string;
}

const VideoFilesList = ({
  setSelectedVideo,
}: {
  setSelectedVideo: (video: SelectedVideo) => void;
}) => {
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/upload/fetch-files`);
      setFileList(res.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files. Please try again.");
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="w-full h-full flex gap-4 mb-4 flex-wrap">
      {error && <p className="text-red-500 text-sm w-full">{error}</p>}
      {fileList.map((file: FileList, index: number) => (
        <div
          key={file.name}
          className="w-[90px] h-[90px] bg-white/10 rounded-md overflow-hidden cursor-pointer"
          onClick={() =>
            setSelectedVideo({
              video: file.videoUrl,
              videoName: file.name,
            })
          }
        >
          <img
            src={`${API_URL}${file.imageUrl}`}
            alt={file.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Error loading image:", e);
              setError("Failed to load some images. Please refresh the page.");
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoFilesList;

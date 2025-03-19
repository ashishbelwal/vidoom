import { Button } from "@heroui/react";
import axios from "axios";
import { DownloadIcon } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
interface SelectedVideo {
  video: string;
  videoName: string;
}

const Navbar = ({ selectedVideo }: { selectedVideo: SelectedVideo }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/upload/download?filename=${selectedVideo.video}`,
        {
          responseType: "blob", // Ensures the file is treated as a downloadable file
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data])); // Create a temporary URL
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", selectedVideo.video); // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <div className="flex z-40 w-full h-auto items-center justify-center data-[menu-open=true]:border-none sticky top-0 inset-x-0 backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-white/[.90] dark:bg-black/[.65]">
      <div className="z-40 flex gap-4 w-full flex-row relative flex-nowrap items-center justify-between  max-w-8xl border-b border-white/10">
        <div className="w-[60px] h-[60px] rounded backdrop-blur-lg data-[menu-open=true]:backdrop-blur-xl backdrop-saturate-150 bg-white/[.90] dark:bg-black/[.65] flex items-center justify-center">
          <p className="text-[30px] font-light">Vi</p>
        </div>
        <div className="flex gap-4 w-full flex-row relative flex-nowrap items-center justify-end  max-w-8xl pr-4">
          <Button
            className="bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-all duration-300"
            endContent={<DownloadIcon size={16} className="ml-2" />}
            onPress={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

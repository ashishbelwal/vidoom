import { Button } from "@heroui/react";
import { DownloadIcon } from "lucide-react";

const Navbar = () => {
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
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

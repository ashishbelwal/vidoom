import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TimelineMarkers from "./TimelineMarkers";

const API_URL = import.meta.env.VITE_API_URL;

const Scrubber = ({
  frameImages,
  loader,
  currentTime,
  setCurrentTime,
}: {
  frameImages: any;
  loader: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}) => {
  return (
    <div className="p-4 max-w-[1400px] w-full h-[200px] bg-[#000000]">
      <div className=" h-full w-full overflow-hidden overflow-x-auto">
        <TimelineMarkers
          frameLength={frameImages.length > 30 ? 30 : frameImages.length}
        />
        {loader ? (
          <div className="flex w-full h-12 bg-[#ffffff0f]  overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: 5,
                opacity: 0.05,
              }}
            />
          </div>
        ) : (
          <div className="flex w-full h-[30px] bg-[#ffffff0f] overflow-hidden">
            {frameImages.map((frameImage: any, index: number) => (
              <div
                key={index}
                className={`flex items-center gap-2 fixed-50 h-auto`}
                style={{
                  backgroundImage: `url('${API_URL}${frameImage.url}')`,
                  backgroundSize: "contain",
                  backgroundPosition: "top",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scrubber;

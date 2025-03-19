import { motion } from "framer-motion";
import TimelineMarkers from "./TimelineMarkers";
import { useEffect, useRef, useState } from "react";
import Frames from "./frames";
import { Slider } from "@heroui/react";

const pixelToSecond = (pixels: number) => {
  return pixels / 50;
};

const secondToPixel = (seconds: number) => {
  return seconds * 50;
};

const Scrubber = ({
  frameImages,
  loader,
  videoElement,
  clipVideo,
  timeRange,
  setTimeRange,
}: {
  frameImages: any;
  loader: boolean;
  videoElement: HTMLVideoElement;
  clipVideo: boolean;
  timeRange: number[];
  setTimeRange: (timeRange: number[]) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const updateVideo = (position: number) => {
    videoElement.currentTime = pixelToSecond(position);
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      setTimeRange([0, videoElement.duration]);
      setDuration(videoElement.duration);
      let markerCurrentPosition = secondToPixel(videoElement.currentTime);
      setCurrentPosition(markerCurrentPosition);
    };
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoElement]);
  return (
    <div className="p-4 max-w-[1400px] w-full h-[200px] bg-[#000000]">
      <div className=" h-full w-full overflow-hidden overflow-x-auto">
        <TimelineMarkers
          frameLength={frameImages.length > 30 ? 30 : frameImages.length}
          videoElement={videoElement}
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
          <div
            ref={containerRef}
            className="flex w-full h-[30px] bg-[#ffffff0f] overflow-hidden cursor-pointer relative"
            // onClick={(e) => {
            //   const position =
            //     e.clientX -
            //     (containerRef.current?.getBoundingClientRect().left ?? 0);
            //   updateVideo(position);
            // }}
          >
            <motion.div
              className={`absolute top-0  w-[1px] h-full bg-white`}
              animate={{
                left: `${currentPosition}px`,
              }}
              transition={{
                speed: 10,
              }}
            ></motion.div>
            <Frames frameImages={frameImages} videoElement={videoElement} />
            {videoElement && clipVideo && (
              <div className="clipVideo">
                <Slider
                  className={` w-[${duration * 50}px]`}
                  formatOptions={{ style: "currency", currency: "USD" }}
                  label="Select a budget"
                  maxValue={duration}
                  minValue={0}
                  step={0.001}
                  value={timeRange}
                  onChange={(value) => setTimeRange(value as number[])}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scrubber;

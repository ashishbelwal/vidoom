import { Slider, Tooltip } from "@heroui/react";
import moment from "moment";
import { ChevronsLeftIcon, ChevronsRightIcon, PlayIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const JUMP_TIME = 5;
const UPDATE_INTERVAL = 1000 / 60; // 30fps
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    // Format: hh:mm:ss
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    // Format: mm:ss
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
};
const VideoControllers = ({
  videoElement,
}: {
  videoElement: HTMLVideoElement;
}) => {
  const [currentSliderValue, setCurrentSliderValue] = useState(0);
  const lastUpdateRef = useRef(0);

  const forwardJump = () => {
    videoElement.currentTime += JUMP_TIME;
  };
  const backwardJump = () => {
    videoElement.currentTime -= JUMP_TIME;
  };
  const playPause = () => {
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      const now = performance.now();
      if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
        const currentTimePercentage =
          (videoElement.currentTime / videoElement.duration) * 100;
        setCurrentSliderValue(currentTimePercentage);
        lastUpdateRef.current = now;
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoElement]);

  const handleSliderChange = (value: number) => {
    videoElement.currentTime = (value / 100) * videoElement.duration;
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex gap-4 justify-center items-center">
        <Tooltip
          content={`-${JUMP_TIME} sec`}
          className="bg-[#080808] text-white"
        >
          <ChevronsLeftIcon
            className="w-6 h-6 hover:cursor-pointer focus:outline-none"
            onClick={backwardJump}
          />
        </Tooltip>
        <Tooltip content="Play / Pause" className="bg-[#080808] text-white">
          <PlayIcon
            className="w-6 h-6 hover:cursor-pointer focus:outline-none"
            fill="white"
            onClick={playPause}
          />
        </Tooltip>
        <Tooltip
          content={`+${JUMP_TIME} sec`}
          className="bg-[#080808] text-white"
        >
          <ChevronsRightIcon
            className="w-6 h-6 hover:cursor-pointer focus:outline-none"
            onClick={forwardJump}
          />
        </Tooltip>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm text-default-600">
              {formatTime(videoElement.currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-default-600">
              {formatTime(videoElement.duration)}
            </p>
          </div>
        </div>
        {/* <Slider
          classNames={{
            base: "max-w-full gap-3",
            track: "border-s-secondary-100",
            filler: "bg-gradient-to-r from-purple-600 to-blue-600",
          }}
          value={currentSliderValue}
          aria-label="track"
          renderThumb={(props) => (
            <div
              {...props}
              className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
            >
              <span className="transition-transform bg-gradient-to-r from-purple-600 to-blue-600 shadow-small  rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
            </div>
          )}
          size="sm"
          onChange={(value) =>
            handleSliderChange(Array.isArray(value) ? value[0] : value)
          }
        /> */}
      </div>
      <div className="w-full h-full bg-red-500"></div>
    </div>
  );
};

export default VideoControllers;

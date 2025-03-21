import { Tooltip } from "@heroui/react";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
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
  const lastUpdateRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
      setCurrentTime(videoElement.currentTime);
      setDuration(videoElement.duration);
      const now = performance.now();
      if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
        lastUpdateRef.current = now;
      }
    };

    videoElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoElement]);

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
          {videoElement.paused ? (
            <PlayIcon
              className="w-6 h-6 hover:cursor-pointer focus:outline-none"
              fill="white"
              onClick={playPause}
            />
          ) : (
            <PauseIcon
              className="w-6 h-6 hover:cursor-pointer focus:outline-none"
              fill="white"
              onClick={playPause}
            />
          )}
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
              {formatTime(currentTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {duration > 0 && (
              <p className="text-sm text-default-600">{formatTime(duration)}</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-red-500"></div>
    </div>
  );
};

export default VideoControllers;

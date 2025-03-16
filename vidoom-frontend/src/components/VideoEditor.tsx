import { useEffect, useState } from "react";
import VideoControllers from "./VideoControllers";
import Scrubber from "./Scrubber";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface SelectedVideo {
  video: string;
  videoName: string;
}

const VideoEditor = ({ selectedVideo }: { selectedVideo: SelectedVideo }) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [loader, setLoader] = useState(true);
  const [frameImages, setFrameImages] = useState<string[]>([]);

  useEffect(() => {
    if (videoElement) {
      console.log(videoElement.currentTime);
    }
  }, [videoElement]);

  const getFrameImages = async () => {
    if (!selectedVideo?.videoName) return;
    const res = await axios.get(
      `${API_URL}/upload/frames/${selectedVideo.videoName}`
    );
    setFrameImages(res.data.frames);
    setLoader(false);
  };

  useEffect(() => {
    if (selectedVideo?.videoName) getFrameImages();
  }, [selectedVideo]);

  return (
    <div className="basis-3/4 h-full flex flex-col justify-center items-center ">
      <div className="basis-full w-full h-screen flex justify-center items-start border-none p-4">
        <div className="w-full flex justify-center items-center  rounded overflow-hidden p-2 border-1 border-[#212121]">
          <div className="w-full max-w-[800px] aspect-video  bg-[#ffffff10]">
            {selectedVideo?.video && (
              <video
                src={`${API_URL}${selectedVideo.video}`}
                className="w-full h-full object-cover"
                ref={setVideoElement}
                autoPlay={true}
                controls={true}
              />
            )}
          </div>
        </div>
      </div>
      {videoElement && <VideoControllers videoElement={videoElement} />}

      {videoElement && (
        <Scrubber
          frameImages={frameImages}
          loader={loader}
          videoElement={videoElement}
        />
      )}
    </div>
  );
};

export default VideoEditor;

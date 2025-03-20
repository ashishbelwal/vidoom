import { addToast, Button, Tab, Tabs } from "@heroui/react";
import Upload from "./Upload";
import VideoFilesList from "./VideoFilesList";
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface SelectedVideo {
  video: string;
  videoName: string;
}

const ControlOptions = ({
  setSelectedVideo,
  setClipVideo,
  clipVideo,
  selectedVideo,
  timeRange,
}: {
  setSelectedVideo: (video: SelectedVideo) => void;
  setClipVideo: (clipVideo: boolean) => void;
  clipVideo: boolean;
  selectedVideo: SelectedVideo;
  setTimeRange: (timeRange: number[]) => void;
  timeRange: number[];
}) => {
  const [seed, setSeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const reset = () => {
    setSeed(Math.random());
  };
  const trimVideo = async () => {
    setIsLoading(true);
    const videoUrl = selectedVideo.video;
    const start = timeRange[0];
    const end = timeRange[1];
    axios
      .post(`${API_URL}/upload/trim`, {
        videoUrl,
        start,
        end,
      })
      .then((response) => {
        console.log(response.data);
        addToast({
          title: "Video trimmed",
          description: "Video trimmed successfully",
          color: "success",
          shouldShowTimeoutProgress: true,
          classNames: {
            title: "text-left",
            base: "bg-[#000000] rounded-md",
            closeButton: "bg-[#000000]",
          },
        });
        reset();
      })
      .catch((error) => {
        console.error(error);
        addToast({
          title: "Video trimming failed",
          description: "Video trimming failed",
          color: "danger",
          shouldShowTimeoutProgress: true,
          classNames: {
            title: "text-left",
            base: "bg-[#000000] rounded-md",
            closeButton: "bg-[#000000]",
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="basis-1/4 border-l border-white/10 w-full h-screen p-4">
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" variant="bordered">
          <Tab key="photos" title="Upload">
            <div className="w-full h-full flex flex-col gap-4">
              <hr className="border-white/10 mt-1" />
              <Upload setSeed={setSeed} />
            </div>
          </Tab>
          <Tab key="edit" title="Edit">
            <div className="w-full h-full flex flex-col gap-4">
              {!selectedVideo?.videoName && (
                <p className="text-white/50 text-sm text-left">
                  Please select a video to edit
                </p>
              )}
              <hr className="border-white/10" />
              <Button
                onPress={() => setClipVideo(!clipVideo)}
                className="max-w-fit rounded-md"
                isDisabled={!selectedVideo?.videoName}
                variant="bordered"
              >
                {clipVideo ? "Exit" : "Clip Video"}
              </Button>
            </div>

            {clipVideo && (
              <div className="w-full h-full flex flex-col gap-4  pt-4 mt-4">
                <>
                  {/* <hr className="border-white/10" /> */}
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-md"
                    isLoading={isLoading}
                    onPress={() => trimVideo()}
                  >
                    {isLoading ? (
                      <>Please wait while we trim video</>
                    ) : (
                      "Trim Video"
                    )}
                  </Button>
                </>
              </div>
            )}
          </Tab>
        </Tabs>
        <hr className="border-white/10 mt-1 mb-4" />
        <p className="text-white/50 text-sm text-left mb-4"> Gallery </p>
        <VideoFilesList
          setSelectedVideo={setSelectedVideo}
          updatedKey={seed}
          selectedVideo={selectedVideo}
        />
      </div>
    </div>
  );
};

export default ControlOptions;

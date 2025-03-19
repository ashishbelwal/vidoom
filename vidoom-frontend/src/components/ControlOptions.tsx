import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import Upload from "./Upload";
import VideoFilesList from "./VideoFilesList";
import { useEffect, useState } from "react";
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
  setTimeRange,
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
  const reset = () => {
    setSeed(Math.random());
  };
  const trimVideo = async () => {
    const videoUrl = selectedVideo.video;
    const start = timeRange[0];
    const end = timeRange[1];
    const response = await axios.post(`${API_URL}/upload/trim`, {
      videoUrl,
      start,
      end,
    });
    if (response.status === 200) {
      const videoUrl = response.data;
      console.log(videoUrl);
      // setSelectedVideo({
      //   video: response.data.videoUrl,
      //   videoName: response.data.videoName,
      // });
    }
    reset();
  };
  return (
    <div className="basis-1/4 border-l border-white/10 w-full h-screen p-4">
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" variant="bordered">
          <Tab key="photos" title="Upload">
            <div className="w-full h-full flex flex-col gap-4">
              <hr className="border-white/10" />
              <Upload />
              <VideoFilesList
                setSelectedVideo={setSelectedVideo}
                updatedKey={seed}
                selectedVideo={selectedVideo}
              />
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
            <div className="w-full h-full flex flex-col gap-4 border-t border-white/10 pt-4 mt-4">
              {clipVideo && (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-md"
                  onPress={() => trimVideo()}
                >
                  Trim Video
                </Button>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlOptions;

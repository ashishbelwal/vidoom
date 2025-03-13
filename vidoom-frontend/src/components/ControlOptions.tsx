import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import Upload from "./Upload";
import VideoFilesList from "./VideoFilesList";

interface SelectedVideo {
  video: string;
  videoName: string;
}

const ControlOptions = ({
  setSelectedVideo,
}: {
  setSelectedVideo: (video: SelectedVideo) => void;
}) => {
  return (
    <div className="basis-1/4 border-l border-white/10 w-full h-screen p-4">
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" variant="bordered">
          <Tab key="photos" title="Upload">
            <div className="w-full h-full flex flex-col gap-4">
              <Upload />
              <VideoFilesList setSelectedVideo={setSelectedVideo} />
            </div>
          </Tab>
          <Tab key="music" title="Music">
            <Card>
              <CardBody>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </CardBody>
            </Card>
          </Tab>
          <Tab key="videos" title="Videos">
            <Card>
              <CardBody>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ControlOptions;

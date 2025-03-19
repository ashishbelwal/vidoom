import "./App.css";
import Navbar from "./components/Navbar";
import ControlOptions from "./components/ControlOptions";
import VideoEditor from "./components/VideoEditor";
import { useState } from "react";
function App() {
  const [selectedVideo, setSelectedVideo] = useState({
    video: "",
    videoName: "",
  });
  const [clipVideo, setClipVideo] = useState(false);
  const [timeRange, setTimeRange] = useState([0, 0]);
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Navbar selectedVideo={selectedVideo} />

      <div className="flex">
        <VideoEditor
          selectedVideo={selectedVideo}
          clipVideo={clipVideo}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <ControlOptions
          setSelectedVideo={setSelectedVideo}
          selectedVideo={selectedVideo}
          setClipVideo={setClipVideo}
          clipVideo={clipVideo}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>
    </div>
  );
}

export default App;

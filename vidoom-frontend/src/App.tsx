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

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Navbar />

      <div className="flex">
        <VideoEditor selectedVideo={selectedVideo} />
        <ControlOptions setSelectedVideo={setSelectedVideo} />
      </div>
    </div>
  );
}

export default App;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec, spawn } = require("child_process");

const uploadRouter = express.Router();


const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const convertMovToMp4 = (inputFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const absoluteInputPath = path.resolve(inputFilePath).replace(/\\/g, "/"); 
    const absoluteOutputPath = path.resolve(outputFilePath).replace(/\\/g, "/");
    console.log({ absoluteInputPath, absoluteOutputPath });

    const command = `gst-launch-1.0 filesrc location="${absoluteInputPath}" ! decodebin ! videoconvert ! x264enc ! mp4mux ! filesink location="${absoluteOutputPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("GStreamer Error:", stderr);
        return reject(`Error converting video: ${stderr}`);
      }

      fs.unlink(absoluteInputPath, (err) => {
        if (err) console.error(`Error deleting original file: ${err}`);
      });

      resolve(outputFilePath);
    });
  });
};


const extractFrames = (videoPath, framesDir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    const command = `gst-launch-1.0 filesrc location="${videoPath.replace(/\\/g, "/")}" ! decodebin ! videoconvert ! videoscale ! videorate ! video/x-raw,framerate=1/1 ! jpegenc ! multifilesink location="${framesDir.replace(/\\/g, "/")}/frame-%04d.jpg"`;


    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`Error extracting frames: ${stderr}`);
      }
      resolve(framesDir);
    });
  });
};

uploadRouter.post("/", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded" });
    }

    const videoName = path.parse(req.file.filename).name;
    const videoFolder = path.join("uploads", videoName);
    const framesFolder = path.join(videoFolder, "frames");

    // Create folders
    fs.mkdirSync(videoFolder, { recursive: true });

    // Convert to MP4
    const mp4Path = path.join(videoFolder, `${videoName}.mp4`);
    await convertMovToMp4(req.file.path, mp4Path);

    // Extract Frames
    await extractFrames(mp4Path, framesFolder);

    res.status(200).json({
      message: "Video processed successfully",
      videoPath: mp4Path,
      framesFolder,
    });
  } catch (error) {
    console.error("Error processing video:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

uploadRouter.get("/fetch-files", (req, res) => {
  try {
    const uploadDir = "uploads/";

    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({ files: [] });
    }

    const files = fs.readdirSync(uploadDir);
    const fileDetails = files
      .map((folder) => {
        const folderPath = path.join(uploadDir, folder);

        if (!fs.lstatSync(folderPath).isDirectory()) {
          return null; 
        }

        const videoFiles = fs.readdirSync(folderPath).filter((file) =>
          file.match(/\.(mp4|mov|webm|mkv|ogg)$/)
        );
        const videoFile = videoFiles.length > 0 ? videoFiles[0] : null;

        const framesDir = path.join(folderPath, "frames");
        let firstImage = null;
        if (fs.existsSync(framesDir)) {
          const images = fs
            .readdirSync(framesDir)
            .filter((file) => file.match(/\.(jpg|jpeg|png)$/))
            .sort(); // Sort to get the first frame
          firstImage = images.length > 0 ? images[0] : null;
        }


        return {
          name: folder,
          imageUrl: firstImage ? `/uploads/${folder}/frames/${firstImage}` : null,
          videoUrl: videoFile ? `/uploads/${folder}/${videoFile}` : null,
        };
      })
      .filter((item) => item !== null); // Remove null entries

    return res.status(200).json({ files: fileDetails });
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



uploadRouter.get("/frames/:videoName", (req, res) => {
  const videoName = req.params.videoName;
  const framesFolder = path.join("uploads", videoName, "frames");

  if (!fs.existsSync(framesFolder)) {
    return res.status(404).json({ error: "Frames not found" });
  }

  const frameFiles = fs.readdirSync(framesFolder).map((file) => ({
    url: `/uploads/${videoName}/frames/${file}`,
  }));

  res.status(200).json({ frames: frameFiles });
});

uploadRouter.post("/trim", (req, res) => {
  const { videoUrl, start, end } = req.body;
  console.log({ videoUrl, start, end });

  // Validate inputs
  if (!videoUrl || start === undefined || end === undefined) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const startSec = parseFloat(start);
  const endSec = parseFloat(end);
  if (isNaN(startSec) || isNaN(endSec) || startSec >= endSec) {
    return res.status(400).json({ error: "Invalid start or end time" });
  }

  // Construct file paths
  const videoName = path.parse(videoUrl).name; // e.g., "1741853539568"
  const videoFolder = path.resolve("uploads", videoName).replace(/\\/g, "/");
  const videoPath = path.resolve(videoFolder, `${videoName}.mp4`).replace(/\\/g, "/");

  // New trimmed folder and file structure
  const timestamp = Date.now();
  const trimmedFolderName = `trimmed_${videoName}_${timestamp}`;
  const trimmedFolderPath = path.resolve("uploads", trimmedFolderName).replace(/\\/g, "/");
  const trimmedVideoPath = path.resolve(trimmedFolderPath, `${trimmedFolderName}.mp4`).replace(/\\/g, "/");
  const framesDir = path.resolve(trimmedFolderPath, "frames").replace(/\\/g, "/");

  // Check if input video exists
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: "Video file not found" });
  }

  // Create trimmed folder
  if (!fs.existsSync(trimmedFolderPath)) {
    fs.mkdirSync(trimmedFolderPath, { recursive: true });
  }

  // Calculate duration and approximate frames for trimming
  const durationSec = endSec - startSec;
  const framerate = 30;
  const numBuffers = Math.floor(durationSec * framerate);

  // GStreamer command (video-only)
  const args = [
    "-e",
    "filesrc",
    `location=${videoPath}`,
    `num-buffers=${numBuffers}`,
    "!",
    "qtdemux",
    "name=demux",
    "demux.video_0",
    "!",
    "queue",
    "!",
    "decodebin",
    "!",
    "videoconvert",
    "!",
    "videoscale",
    "!",
    "videorate",
    "!",
    `video/x-raw,framerate=${framerate}/1`,
    "!",
    "x264enc",
    "!",
    "mp4mux",
    "!",
    "filesink",
    `location=${trimmedVideoPath}`,
  ];

  const gstProcess = spawn("gst-launch-1.0", args);

  let stdoutData = "";
  let stderrData = "";

  gstProcess.stdout.on("data", (data) => {
    stdoutData += data.toString();
    console.log("stdout:", data.toString());
  });

  gstProcess.stderr.on("data", (data) => {
    stderrData += data.toString();
    console.error("stderr:", data.toString());
  });

  gstProcess.on("close", (code) => {
    console.log("Trim process exited with code:", code);
    if (code !== 0) {
      return res.status(500).json({
        error: "Failed to trim video",
        details: stderrData || "Unknown error",
      });
    }

    // Extract frames from the trimmed video
    extractFrames(trimmedVideoPath, framesDir)
      .then((framesDir) => {
        return res.status(200).json({
          message: "Video trimmed and frames extracted successfully",
          trimmedVideoUrl: trimmedVideoPath,
          framesFolder: framesDir,
        });
      })
      .catch((error) => {
        console.error("Frame extraction failed:", error);
        return res.status(500).json({
          error: "Failed to extract frames",
          details: error,
        });
      });
  });

  gstProcess.on("error", (err) => {
    console.error("Failed to start trim process:", err.message);
    return res.status(500).json({ error: "Trim process failed to start", details: err.message });
  });
});

uploadRouter.get("/download", (req, res) => {
 
  const { filename } = req.query; 
  if (!filename) {
    return res.status(400).json({ error: "Filename is required" });
  }

  const filePath = path.normalize(path.join(__dirname, "..", filename)).replace(/\\/g, "/");

  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

module.exports = uploadRouter;

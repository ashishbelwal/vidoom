const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

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
    console.log({files})
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

module.exports = uploadRouter;

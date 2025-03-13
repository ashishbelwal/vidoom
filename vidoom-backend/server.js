const express = require("express");
const cors = require("cors")
const uploadRouter = require("./apis/uploadApi");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/upload", uploadRouter);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






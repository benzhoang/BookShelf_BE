const express = require("express");
const router = express.Router();
const UpLoadImgMiddleWare = require("../middlewares/uploadImage.middlewares");

router.post("/", UpLoadImgMiddleWare.uploadImage);

module.exports = router;

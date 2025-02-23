
const upload = require("../configs/upload.config");

exports.uploadImage = async (req, res) => {
    try {
        upload.array("images", 5)(req, res, async (err) => {
            if (err) return res.status(400).json({ message: "Image upload failed", error: err.message });

            // Lấy danh sách URL ảnh từ Cloudinary
            const imageUrls = req.files.map(file => file.path);

            res.status(200).json({ message: "Images uploaded successfully!", imageUrls });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
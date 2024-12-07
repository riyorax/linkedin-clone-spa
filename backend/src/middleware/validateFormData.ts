import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import * as userService from "../services/user.service";
import path from "path";

const BASEURL = "http://localhost:3000/";

const fs = require('fs');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

const deleteImageFile = (url) => {
  const imagePath = url.split("localhost:3000")[1];
  if (imagePath) {
    const fullPath = path.join('../upload', imagePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Failed to delete image:', err);
      } else {
        console.log('Image deleted successfully');
      }
    });
  }
}

export const formDataMiddleware = (req, res, next) => {
  try {
    const uploadHandler = upload.fields([{ name: "profile_photo", maxCount: 1 }]);

    uploadHandler(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Multer error: ${err.message}`,
          error: err,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
          error: err,
        });
      }

      const userId = parseInt(req.params.id);

      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
          error: null,
        });
      }

      const currentUser = await userService.getUserById(userId);
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          error: null,
        });
      }

      const { username, previous_photo } = req.body;

      if (username && username !== currentUser.username) {
        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Username already exists",
            error: null,
          });
        }
      }

      if (req.files && req.files.profile_photo) {
        const fileBuffer = req.files.profile_photo[0].buffer;
        const fileOriginalName = req.files.profile_photo[0].originalname;
        const uniqueId = uuidv4();
        const extension = path.extname(fileOriginalName);
        const fileName = `${uniqueId}${extension}`;

        fs.writeFileSync(`../upload/image/${fileName}`, fileBuffer);
        req.body.new_profile_photo = `${BASEURL}image/${fileName}`;

        const url = currentUser.profile_photo_path;
        deleteImageFile(url);
      } else {
        req.body.new_profile_photo = null;
      }

      if (previous_photo) {
        const url = currentUser.profile_photo_path;
        deleteImageFile(url);
      }

      next();
    });
  } catch (err) {
    next(new Error("Unexpected error occurred during file upload"));
  }
};

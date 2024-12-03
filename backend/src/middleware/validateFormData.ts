import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const BASEURL = "http://localhost:3000/"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      cb(null, ("../uploads/images"));
    } catch (err) {
      cb(new Error("Failed to set upload destination"), false);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueId = uuidv4();
      const extension = path.extname(file.originalname);
      const uniqueName = `${uniqueId}${extension}`;
      const filePath = path.join(uniqueName);
      cb(null, filePath);
    } catch (err) {
      cb(new Error("Failed to generate unique filename"), false);
    }
  },
});

const fileFilter = (req, file, cb) => {
  try {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed!"), false);
    }
  } catch (err) {
    cb(new Error("Error while filtering file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

export const formDataMiddleware = (req, res, next) => {
  try {
    const uploadHandler = upload.fields([{ name: "profile_photo", maxCount: 1 }]);
    uploadHandler(req, res, (e) => {
      if (e instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Multer error: ${e.message}`,
          error: e,
        });
      } else if (e) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${e.message}`,
          error: e,
        });
      }

      if (req.files && req.files.profile_photo) {
        const filePath = req.files.profile_photo[0].path;
        const fileName = path.basename(filePath);
        req.body.profilePhoto = `${BASEURL}image/${fileName}`;
      } else {
        req.body.profilePhoto = null;
      }
      next();
    });
  } catch (err) {
    next(new Error("Unexpected error occurred during file upload"));
  }
};

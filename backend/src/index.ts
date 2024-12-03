import express from "express";
import userRouter from "./routes/user.router";
import profileRouter from "./routes/profile.router";
import connectionRouter from "./routes/connection.router";
import connectionRequestRouter from "./routes/connRequest.router";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import feedRouter from "./routes/feed.router";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", profileRouter);
app.use("/api", connectionRouter);
app.use("/api", connectionRequestRouter);
app.use("/api", feedRouter);
app.use("/image", express.static(path.resolve(__dirname, "../../uploads/images")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
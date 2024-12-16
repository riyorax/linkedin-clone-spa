import express, { Request, Response, Router } from "express";
import userRouter from "./routes/user.router";
import profileRouter from "./routes/profile.router";
import connectionRouter from "./routes/connection.router";
import connectionRequestRouter from "./routes/connRequest.router";
import chatRouter from "./routes/chat.router";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import feedRouter from "./routes/feed.router";
import path from "path";
import { app, server } from "./lib/socket";
import webpush from "web-push";
import notifRouter from "./routes/notif.router";
import { setupSwagger } from "./lib/swagger";

dotenv.config();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
  throw new Error("VAPID keys are not defined in the env file.");
}

webpush.setVapidDetails(
  "mailto:13522061@std.stei.itb.ac.id",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

const healthRouter = Router();
healthRouter.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "healthy"
  });
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api", userRouter);
app.use("/api", profileRouter);
app.use("/api", connectionRouter);
app.use("/api", connectionRequestRouter);
app.use("/api", feedRouter);
app.use("/api", chatRouter);
app.use("/api", notifRouter);
app.use("/health", healthRouter);

app.use(
  "/image",
  express.static(path.resolve(__dirname, "../../upload/image")),
);

setupSwagger(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
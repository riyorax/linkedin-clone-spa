import express from "express";
import userRouter from "./routes/user.router";
import profileRouter from "./routes/profile.router";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
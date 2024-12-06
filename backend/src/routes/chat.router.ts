import { Router } from "express";
import { verifyToken } from "../middleware/verifytoken";
import { validateParamId } from "../middleware/validateinput";
import { getUsersForSidebar, getMessages, sendMessages } from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.get("/chat/users", verifyToken, getUsersForSidebar);
chatRouter.get("/chat/:id", validateParamId, verifyToken, getMessages);
chatRouter.post("/chat/:id", validateParamId, verifyToken, sendMessages); 

export default chatRouter;
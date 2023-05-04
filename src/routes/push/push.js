import express from "express";
import { asyncWrap, auth } from "../../utils";
import { saveExpoToken } from "../../services/push/saveExpoToken";

const pushRouter = express.Router();

pushRouter.post("/token", auth, asyncWrap(saveExpoToken));

export default pushRouter;

import express from "express";
import { asyncWrap, auth } from "../../utils";
import { saveExpoToken } from "../../services/push/saveExpoToken";
import { pushTest } from "../../services/push/pushTest";

const pushRouter = express.Router();

pushRouter.post("/token", auth, asyncWrap(saveExpoToken));
pushRouter.post("/test", asyncWrap(pushTest));

export default pushRouter;

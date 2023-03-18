import express from "express";
import { createAccount } from "../../services/points/createAccount";
import { getMyPointInfo } from "../../services/points/getMyPointInfo";

import { asyncWrap, auth } from "../../utils";

const pointsRouter = express.Router();

pointsRouter.get("/my", auth, asyncWrap(getMyPointInfo));

pointsRouter.post("/account/create", asyncWrap(createAccount));

export default pointsRouter;

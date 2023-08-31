import express from "express";
import { createAccount } from "../../services/points/createAccount";
import { getMyPointInfo } from "../../services/points/getMyPointInfo";

import { asyncWrap, auth } from "../../utils";
import { getPointBreakdown } from "../../services/points/getPointBreakdown";

const pointsRouter = express.Router();

pointsRouter.get("/my", auth, asyncWrap(getMyPointInfo));
pointsRouter.get("/breakdown", auth, asyncWrap(getPointBreakdown));

pointsRouter.post("/account/create", asyncWrap(createAccount));

export default pointsRouter;

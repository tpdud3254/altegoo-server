import express from "express";
import { createAccount } from "../../services/points/createAccount";
import { getMyPointInfo } from "../../services/points/getMyPointInfo";

import { asyncWrap, auth } from "../../utils";
import { getPointBreakdown } from "../../services/points/getPointBreakdown";
import { withdrawalPoints } from "../../services/points/withdrawalPoints";
import { chargePoint } from "../../services/points/chargePoint";

const pointsRouter = express.Router();

pointsRouter.get("/my", auth, asyncWrap(getMyPointInfo));
pointsRouter.get("/breakdown", auth, asyncWrap(getPointBreakdown));

pointsRouter.post("/account/create", asyncWrap(createAccount));

pointsRouter.patch("/withdrawal", auth, asyncWrap(withdrawalPoints));
pointsRouter.patch("/charge", auth, asyncWrap(chargePoint));

export default pointsRouter;

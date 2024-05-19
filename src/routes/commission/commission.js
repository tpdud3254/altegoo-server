import express from "express";
import { getCommissionList } from "../../services/commission/getCommissionList";
import { setCommission } from "../../services/commission/setCommission";

const commissionRouter = express.Router();

commissionRouter.get("/", getCommissionList);

commissionRouter.patch("/", setCommission);

export default commissionRouter;

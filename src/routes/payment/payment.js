import express from "express";
import { Callback, asyncWrap } from "../../utils";
import { registWork } from "../../services/works/registWork";

const paymentRouter = express.Router();

paymentRouter.post("/callback", Callback, asyncWrap(registWork));

export default paymentRouter;

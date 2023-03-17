import express from "express";
import { asyncWrap, auth } from "../../utils";
import { registWork } from "../../services/works/registWork";
import { getWorkList } from "../../services/works/getWorkList";
import { getOrderInProgressCounts } from "../../services/works/getOrderInProgressCounts";
import { setWorkStatus } from "../../services/works/setWorkStatus";
import { addReservation } from "../../services/works/addReservation";
import { deleteReservation } from "../../services/works/deleteReservation";
import { getMyWorkList } from "../../services/works/getMyWorkList";
import { getMyAcceptList } from "../../services/works/getMyAcceptList";
import { getMyRegistList } from "../../services/works/getMyRegistList";

const worksRouter = express.Router();

worksRouter.get("/list", auth, asyncWrap(getWorkList));
worksRouter.get("/mylist", auth, asyncWrap(getMyWorkList));
worksRouter.get("/count/progress", auth, asyncWrap(getOrderInProgressCounts));
worksRouter.get("/mylist/accept", auth, asyncWrap(getMyAcceptList));
worksRouter.get("/mylist/regist", auth, asyncWrap(getMyRegistList));

worksRouter.post("/upload", auth, asyncWrap(registWork));
worksRouter.post("/reservation", auth, asyncWrap(addReservation));

worksRouter.delete("/reservation", auth, asyncWrap(deleteReservation));

worksRouter.patch("/status", auth, asyncWrap(setWorkStatus));

export default worksRouter;

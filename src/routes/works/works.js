import express from "express";
import { auth } from "../../utils";
import { registWork } from "../../services/works/registWork";
import { getWorkList } from "../../services/works/getWorkList";
import { getOrderInProgressCounts } from "../../services/works/getOrderInProgressCounts";
import { setWorkStatus } from "../../services/works/setWorkStatus";
import { addReservation } from "../../services/works/addReservation";
import { deleteReservation } from "../../services/works/deleteReservation";
import { getMyWorkList } from "../../services/works/getMyWorkList";

const worksRouter = express.Router();

worksRouter.get("/list", auth, getWorkList);
worksRouter.get("/mylist", auth, getMyWorkList);
worksRouter.get("/count/progress", auth, getOrderInProgressCounts);

worksRouter.post("/upload", auth, registWork);
worksRouter.post("/reservation", auth, addReservation);

worksRouter.delete("/reservation", auth, deleteReservation);

worksRouter.patch("/status", auth, setWorkStatus);

export default worksRouter;

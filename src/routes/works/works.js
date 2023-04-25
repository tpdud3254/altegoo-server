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
import { getWorkInfo } from "../../services/works/getWorkInfo";
import { acceptOrder } from "../../services/works/acceptOrder";
import { cancleOrder } from "../../services/works/cancleOrder";
import { startMoving } from "../../services/works/startMoving";
import { startWork } from "../../services/works/startWork";
import { doneWork } from "../../services/works/doneWork";
import { terminateWork } from "../../services/works/terminateWork";
import { removeOrder } from "../../services/works/removeOrder";

const worksRouter = express.Router();

worksRouter.get("/list", auth, asyncWrap(getWorkList));
worksRouter.get("/mylist", auth, asyncWrap(getMyWorkList));
worksRouter.get("/count/progress", auth, asyncWrap(getOrderInProgressCounts));
worksRouter.get("/mylist/accept", auth, asyncWrap(getMyAcceptList));
worksRouter.get("/mylist/regist", auth, asyncWrap(getMyRegistList));
worksRouter.get("/work", auth, asyncWrap(getWorkInfo));

worksRouter.patch("/status", auth, asyncWrap(setWorkStatus));

///////////////////////////////////////////////////////////////////////////////////////
//작업등록
worksRouter.post("/upload", auth, asyncWrap(registWork));

//작업취소 //registUser
worksRouter.patch("/remove", auth, asyncWrap(removeOrder));

//작업예약 //acceptUser
worksRouter.patch("/order/accept", auth, asyncWrap(acceptOrder));

//예약취소 //acceptUser
worksRouter.patch("/order/cancle", auth, asyncWrap(cancleOrder));

//예약대기
worksRouter.patch("/order/reservation", auth, asyncWrap(addReservation));

//예약대기취소
worksRouter.delete("/order/reservation", auth, asyncWrap(deleteReservation));

//작업출발 //acceptUser
worksRouter.patch("/order/move", auth, asyncWrap(startMoving));

//작업시작 //acceptUser
worksRouter.patch("/order/start", auth, asyncWrap(startWork));

//작업완료 //acceptUser
worksRouter.patch("/order/done", auth, asyncWrap(doneWork));

//작업종료 //registUser
worksRouter.patch("/order/confirm", auth, asyncWrap(terminateWork));

export default worksRouter;

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

const worksRouter = express.Router();

worksRouter.get("/list", auth, asyncWrap(getWorkList));
worksRouter.get("/mylist", auth, asyncWrap(getMyWorkList));
worksRouter.get("/count/progress", auth, asyncWrap(getOrderInProgressCounts));
worksRouter.get("/mylist/accept", auth, asyncWrap(getMyAcceptList));
worksRouter.get("/mylist/regist", auth, asyncWrap(getMyRegistList));
worksRouter.get("/work", auth, asyncWrap(getWorkInfo));

worksRouter.post("/upload", auth, asyncWrap(registWork));
worksRouter.post("/reservation", auth, asyncWrap(addReservation));

worksRouter.delete("/reservation", auth, asyncWrap(deleteReservation));

worksRouter.patch("/status", auth, asyncWrap(setWorkStatus));

///////////////////////////////////////////////////////////////////////////////////////

//작업예약
worksRouter.patch("/order/accept", auth, asyncWrap(acceptOrder));

//작업취소
//예약취소
//예약대기
//예약대기취소
//작업출발
//작업시작
//작업완료
//작업종료

export default worksRouter;

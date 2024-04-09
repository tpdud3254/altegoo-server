import express from "express";
import { asyncWrap, auth } from "../../utils";
import { getMyWorkList } from "../../services/orders/getMyWorkList";
import { getMyOrderList } from "../../services/orders/getMyOrderList";
import { getOrder } from "../../services/orders/getOrder";
import { deleteOrder } from "../../services/orders/deleteOrder";
import { getMyAcceptList } from "../../services/orders/getMyAcceptList";
import { getRealTimeOrderList } from "../../services/orders/getRealTimeOrderList";
import { getVBankOrder } from "../../services/orders/getVBankOrder";
import { getMyVBankOrderList } from "../../services/orders/getMyVBankOrderList";

const ordersRouter = express.Router();

ordersRouter.get("/mylist", auth, asyncWrap(getMyWorkList)); //홈
ordersRouter.get("/mylist/all", auth, asyncWrap(getMyOrderList)); //작업내역
ordersRouter.get("/info", asyncWrap(getOrder));
ordersRouter.get("/accept", auth, asyncWrap(getMyAcceptList));
ordersRouter.get("/realtime", auth, asyncWrap(getRealTimeOrderList));
ordersRouter.get("/vbank/info", asyncWrap(getVBankOrder));
ordersRouter.get("/vbank/list", auth, asyncWrap(getMyVBankOrderList));

ordersRouter.delete("/delete", auth, asyncWrap(deleteOrder));

// ordersRouter.get("/list", auth, asyncWrap(getWorkList));
// ordersRouter.get("/count/progress", auth, asyncWrap(getOrderInProgressCounts));
// ordersRouter.get("/mylist/accept", auth, asyncWrap(getMyAcceptList));
// ordersRouter.get("/mylist/regist", auth, asyncWrap(getMyRegistList));
// ordersRouter.get("/work", auth, asyncWrap(getWorkInfo));

// ordersRouter.patch("/status", auth, asyncWrap(setWorkStatus));

// ///////////////////////////////////////////////////////////////////////////////////////
// //작업등록
// ordersRouter.post("/upload", auth, asyncWrap(registWork));

// //작업취소 //registUser
// ordersRouter.patch("/remove", auth, asyncWrap(removeOrder));

// //작업예약 //acceptUser
// ordersRouter.patch("/order/accept", auth, asyncWrap(acceptOrder));

// //예약취소 //acceptUser
// ordersRouter.patch("/order/cancel", auth, asyncWrap(cancelOrder));

// //예약대기
// ordersRouter.patch("/order/reservation", auth, asyncWrap(addReservation));

// //예약대기취소
// ordersRouter.delete("/order/reservation", auth, asyncWrap(deleteReservation));

// //작업출발 //acceptUser
// ordersRouter.patch("/order/move", auth, asyncWrap(startMoving));

// //작업시작 //acceptUser
// ordersRouter.patch("/order/start", auth, asyncWrap(startWork));

// //작업완료 //acceptUser
// ordersRouter.patch("/order/done", auth, asyncWrap(doneWork));

// //작업종료 //registUser
// ordersRouter.patch("/order/confirm", auth, asyncWrap(terminateWork));

export default ordersRouter;

import express from "express";
import { addNotice } from "../../services/admin/notice/addNotice";
import { updateCurPoints } from "../../services/admin/points/updateCurPoints";
import getUsers from "../../services/admin/user/gerUsers";
import { updateRecommendUser } from "../../services/admin/user/updateRecommendUser";
import getVehleFloor from "../../services/admin/vehicle/getVehleFloor";
import getVehleWeight from "../../services/admin/vehicle/getVehleWeight";
import getUser from "../../services/admin/user/getUser";
import { subtractPoints } from "../../services/admin/points/subtractPoints";
import { deleteUsers } from "../../services/admin/user/deleteUsers";
import { modifyLicense } from "../../services/admin/user/modifyLicense";
import { modifyPermission } from "../../services/admin/user/modifyPermission";
import { modifyVehicle } from "../../services/admin/vehicle/modifyVehicle";
import { getUserWithPhone } from "../../services/admin/user/getUserWithPhone";
import getMembershipUsers from "../../services/admin/user/getMembershipUsers";
import getOrders from "../../services/admin/order/getOrders";
import { cancelOrder } from "../../services/admin/order/cancelOrder";
import getWithdrawalList from "../../services/admin/points/getWithdrawalList";

const adminRouter = express.Router();

adminRouter.get("/user", getUser);
adminRouter.get("/user/phone", getUserWithPhone);
adminRouter.get("/users", getUsers);
adminRouter.get("/users/membership", getMembershipUsers);
adminRouter.get("/vehicle/floor", getVehleFloor);
adminRouter.get("/vehicle/weight", getVehleWeight);
adminRouter.get("/orders", getOrders);
adminRouter.get("/withdrawal", getWithdrawalList);

adminRouter.post("/notice/add", addNotice);
adminRouter.post("/upload/license", modifyLicense);
adminRouter.post("/upload/permission", modifyPermission);

adminRouter.patch("/points", updateCurPoints);
adminRouter.patch("/points/subtract", subtractPoints);
adminRouter.patch("/recommend", updateRecommendUser);
adminRouter.patch("/vehicle", modifyVehicle);
adminRouter.patch("/order/cancel", cancelOrder);

adminRouter.delete("/users/delete", deleteUsers);

//TODO: 포인트는 기존 내역 수정하지 마고 내역쌓기
export default adminRouter;

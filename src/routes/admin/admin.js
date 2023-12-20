import express from "express";
import { addNotice } from "../../services/admin/notice/addNotice";
import { updateCurPoints } from "../../services/admin/points/updateCurPoints";
import getUsers from "../../services/admin/user/gerUsers";
import { updateRecommendUser } from "../../services/admin/user/updateRecommendUser";
import getVehleFloor from "../../services/admin/vehicle/getVehleFloor";
import getVehleWeight from "../../services/admin/vehicle/getVehleWeight";
import getUser from "../../services/admin/user/getUser";
import { subtractPoints } from "../../services/admin/points/subtractPoints";

const adminRouter = express.Router();

adminRouter.get("/user", getUser);
adminRouter.get("/users", getUsers);
adminRouter.get("/vehicle/floor", getVehleFloor);
adminRouter.get("/vehicle/weight", getVehleWeight);
adminRouter.patch("/points", updateCurPoints);
adminRouter.patch("/points/subtract", subtractPoints);
adminRouter.patch("/recommend", updateRecommendUser);
adminRouter.post("/notice/add", addNotice);

//TODO: 포인트는 기존 내역 수정하지 마고 내역쌓기
export default adminRouter;

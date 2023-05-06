import express from "express";
import { addNotice } from "../../services/admin/notice/addNotice";
import { updateCurPoints } from "../../services/admin/points/updateCurPoints";
import getUsers from "../../services/admin/user/gerUsers";
import { updateRecommendUser } from "../../services/admin/user/updateRecommendUser";

const adminRouter = express.Router();

adminRouter.get("/users", getUsers);
adminRouter.patch("/points", updateCurPoints);
adminRouter.patch("/recommend", updateRecommendUser);
adminRouter.post("/notice/add", addNotice);

//TODO: 포인트는 기존 내역 수정하지 마고 내역쌓기
export default adminRouter;

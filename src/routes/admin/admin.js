import express from "express";
import { addNotice } from "../../services/admin/notice/addNotice";
import { updateCurPoints } from "../../services/admin/points/updateCurPoints";
import getUsers from "../../services/admin/user/getUsers";
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
import { updateOrder } from "../../services/admin/order/updateOrder";
import { deleteOrder } from "../../services/admin/order/deleteOrder";
import getKakaoUrl from "../../services/admin/getKakaoUrl";
import { setGugupackPrice } from "../../services/admin/price/setGugupackPrice";
import { setOrderPrice } from "../../services/admin/price/setOrderPrice";
import { getOrderPrice } from "../../services/admin/price/getOrderPrice";
import { setReservationBlock } from "../../services/admin/user/setReservationBlock";
import { getBannerList } from "../../services/admin/banner/getBannerList";
import { saveBannerImage } from "../../services/admin/banner/saveBannerImage";
import { asyncWrap, upload } from "../../utils";
import { setBannerImage } from "../../services/admin/banner/setBannerImage";
import { setBannerLink } from "../../services/admin/banner/setBannerLink";
import { savePopupImage } from "../../services/admin/popup/savePopupImage";
import { setPopupImage } from "../../services/admin/popup/setPopupImage";
import { getPopup } from "../../services/admin/popup/getPopup";
import { getMembershipPrice } from "../../services/admin/price/getMembershipPrice";
import { setMembershipPrice } from "../../services/admin/price/setMembershipPrice";
import { modifyCompanyName } from "../../services/admin/user/modifyCompanyName";
import { registWork } from "../../services/admin/order/registWork";
import getPostpaidOrders from "../../services/admin/order/getPostpaidOrders";
import setPostpaidOrder from "../../services/admin/order/setPostpaidOrder";
import { getGugupackSubscribeList } from "../../services/admin/user/getGugupackSubscribeList";
import { confirmGugupack } from "../../services/admin/user/confirmGugupack";
import { cancelMembership } from "../../services/admin/user/cancelMembership";
import { modifyNickname } from "../../services/admin/user/modifyNickname";
import { createAccount } from "../../services/admin/createAccount";
import { checkAccount } from "../../services/admin/checkAccount";
import { login } from "../../services/admin/login";
import { verifyToken } from "../../services/admin/verifyToken";
import { getAdminList } from "../../services/admin/getAdminList";
import { toggleAdminStatus } from "../../services/admin/toggleAdminStatus";
import { updateAccount } from "../../services/admin/updateAccount";
import { deleteAdmin } from "../../services/admin/deleteAdmin";
import getVehicleCraneWeight from "../../services/admin/vehicle/getVehicleCraneWeight";

const adminRouter = express.Router();

adminRouter.get("/user", getUser);
adminRouter.get("/user/phone", getUserWithPhone);
adminRouter.get("/users", getUsers);
adminRouter.get("/users/membership", getMembershipUsers);
adminRouter.get("/vehicle/floor", getVehleFloor);
adminRouter.get("/vehicle/weight", getVehleWeight);
adminRouter.get("/vehicle/crane", getVehicleCraneWeight);
adminRouter.get("/orders", getOrders);
adminRouter.get("/orders/postpaid", getPostpaidOrders);
adminRouter.get("/withdrawal", getWithdrawalList);
adminRouter.get("/kakao", getKakaoUrl);
adminRouter.get("/price/order", getOrderPrice);
adminRouter.get("/price/membership", getMembershipPrice);
adminRouter.get("/banner", getBannerList);
adminRouter.get("/popup", getPopup);
adminRouter.get("/gugupack/subscribe", getGugupackSubscribeList);
adminRouter.get("/list", getAdminList);

adminRouter.post("/login", login);
adminRouter.post("/token", asyncWrap(verifyToken));
adminRouter.post("/check", checkAccount);
adminRouter.post("/create", createAccount);
adminRouter.post("/update", updateAccount);
adminRouter.post("/notice/add", addNotice);
adminRouter.post("/upload/license", modifyLicense);
adminRouter.post("/upload/permission", modifyPermission);
adminRouter.post("/vehicle", modifyVehicle);
adminRouter.post("/company", modifyCompanyName);
adminRouter.post("/nickname", modifyNickname);
adminRouter.post("/banner", upload.single("file"), asyncWrap(saveBannerImage));
adminRouter.post("/upload/banner", setBannerImage);
adminRouter.post("/popup", upload.single("file"), asyncWrap(savePopupImage));
adminRouter.post("/upload/popup", setPopupImage);
adminRouter.post("/upload/work", asyncWrap(registWork));
adminRouter.post("/gugupack/confirm", asyncWrap(confirmGugupack));

adminRouter.patch("/points", updateCurPoints);
adminRouter.patch("/points/subtract", subtractPoints);
adminRouter.patch("/recommend", updateRecommendUser);
adminRouter.patch("/order/cancel", cancelOrder);
adminRouter.patch("/order/update", updateOrder);
adminRouter.patch("/price/order", setOrderPrice);
adminRouter.patch("/price/gugupack", setGugupackPrice);
adminRouter.patch("/price/membership", setMembershipPrice);
adminRouter.patch("/user/block", setReservationBlock);
adminRouter.patch("/banner/link", setBannerLink);
adminRouter.patch("/order/calculate", asyncWrap(setPostpaidOrder));
adminRouter.patch("/users/membership/cancel", cancelMembership);
adminRouter.patch("/status", toggleAdminStatus);

adminRouter.delete("/users/delete", deleteUsers);
adminRouter.delete("/delete", deleteAdmin);
adminRouter.delete("/order", deleteOrder);

//TODO: 포인트는 기존 내역 수정하지 마고 내역쌓기
export default adminRouter;

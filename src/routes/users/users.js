import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { getUserExist } from "../../services/users/getUserExist";
import { login } from "../../services/users/login";
import { setPassword } from "../../services/users/setPassword";
import { asyncWrap, auth, existUser, upload, uploadFile } from "../../utils";
import { verifyToken } from "../../services/users/verifyToken";
import { saveLicense } from "../../services/users/saveLicense";
import { saveVehiclePermission } from "../../services/users/saveVehiclePermission";
import { getUserPoint } from "../../services/users/getUserPoint";
import prisma from "../../prisma";
import { getDirverCount } from "../../services/users/getDriverUserCount";
import { getRecommendUser } from "../../services/users/getRecommendUser";
import { getUserWithId } from "../../services/users/getUserWithId";
import { addVehicle } from "../../services/users/addVehicle";
import { addLicense } from "../../services/users/addLicense";
import { addPermission } from "../../services/users/addPermission";
import { modifyRegion } from "../../services/users/modifyRegion";
import { changePassword } from "../../services/users/changePassword";
import { certification } from "../../services/users/certification";
import { decoding } from "../../services/users/decoding";
import { cancelGugupack } from "../../services/users/cancelGugupack";
import { getGugupackPrice } from "../../services/users/getGugupackPrice";
import { subscribeGugupack } from "../../services/users/subscribeGugupack";
import { waitingGugupack } from "../../services/users/waitingGugupack";
import { searchRecommendUser } from "../../services/users/searchRecommendUser";

const usersRouter = express.Router();

usersRouter.get("/search", asyncWrap(getUserExist));
usersRouter.get("/point", auth, asyncWrap(getUserPoint));
usersRouter.get("/user/recommend", auth, asyncWrap(getRecommendUser));
usersRouter.get("/user/search/recommend", asyncWrap(searchRecommendUser));
usersRouter.get("/driver/count", asyncWrap(getDirverCount));
usersRouter.get("/user", asyncWrap(getUserWithId));
usersRouter.get("/certification", asyncWrap(certification));
usersRouter.get("/gugupack/price", asyncWrap(getGugupackPrice));
usersRouter.get("/gugupack/subscribe", auth, asyncWrap(subscribeGugupack));
usersRouter.get("/gugupack/waiting", auth, asyncWrap(waitingGugupack));

usersRouter.post("/user", asyncWrap(verifyToken));
usersRouter.post("/create", asyncWrap(createAccount));
usersRouter.post("/login", asyncWrap(login));
usersRouter.post("/password", asyncWrap(setPassword));
// usersRouter.post("/edit", auth, asyncWrap(editProfile));
usersRouter.post("/certification", asyncWrap(decoding));
usersRouter.post("/gugupack/cancel", asyncWrap(cancelGugupack));

// usersRouter.post("/certification", asyncWrap(certification));

usersRouter.post("/setting/password", auth, asyncWrap(changePassword));
usersRouter.post("/setting/vehicle", auth, asyncWrap(addVehicle));
usersRouter.post("/setting/region", auth, asyncWrap(modifyRegion));
usersRouter.post("/setting/license", auth, asyncWrap(addLicense));
usersRouter.post("/setting/permission", auth, asyncWrap(addPermission));
usersRouter.post("/license", upload.single("file"), asyncWrap(saveLicense));
usersRouter.post(
    "/permission",
    upload.single("file"),
    asyncWrap(saveVehiclePermission)
);

//TODO:set status (탈퇴시 withdrawalDate와 함께)
//TODO:get workRegion
//TODO:set accessedRegion
//TODO:set grade
//TODO:set pointBreakdown
//TODO:get pointBreakdown
//TODO:set withdrawalDate (탈퇴)(status와 함께)

export default usersRouter;

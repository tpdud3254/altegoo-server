import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { getUserExist } from "../../services/users/getUserExist";
import { login } from "../../services/users/login";
import { setPassword } from "../../services/users/setPassword";
import { editProfile } from "../../services/users/editProfile";
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
import { joinRPack } from "../../services/users/joinRPack";
import { cancelRPack } from "../../services/users/cancelRPack";

const usersRouter = express.Router();

usersRouter.get("/search", asyncWrap(getUserExist));
usersRouter.get("/point", auth, asyncWrap(getUserPoint));
usersRouter.get("/user/recommend", auth, asyncWrap(getRecommendUser));
usersRouter.get("/driver/count", asyncWrap(getDirverCount));
usersRouter.get("/user", asyncWrap(getUserWithId));
usersRouter.get("/certification", asyncWrap(certification));

usersRouter.post("/user", asyncWrap(verifyToken));
usersRouter.post("/create", asyncWrap(createAccount));
usersRouter.post("/login", asyncWrap(login));
usersRouter.post("/password", asyncWrap(setPassword));
usersRouter.post("/edit", auth, asyncWrap(editProfile));
usersRouter.post("/certification", asyncWrap(decoding));
usersRouter.post("/rpack/join", asyncWrap(joinRPack));
usersRouter.post("/rpack/cancel", asyncWrap(cancelRPack));

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

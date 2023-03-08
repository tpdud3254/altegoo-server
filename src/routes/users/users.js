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

const usersRouter = express.Router();

usersRouter.get("/search", asyncWrap(getUserExist));
usersRouter.get("/point", auth, getUserPoint);

usersRouter.post("/user", verifyToken);
usersRouter.post("/create", createAccount);
usersRouter.post("/login", login);
usersRouter.post("/password", setPassword);
usersRouter.post("/edit", auth, editProfile);

usersRouter.post("/license", upload.single("file"), saveLicense);
usersRouter.post("/permission", upload.single("file"), saveVehiclePermission);

//TODO:set status (탈퇴시 withdrawalDate와 함께)
//TODO:get workRegion
//TODO:set accessedRegion
//TODO:set grade
//TODO:set pointBreakdown
//TODO:get pointBreakdown
//TODO:set withdrawalDate (탈퇴)(status와 함께)

export default usersRouter;

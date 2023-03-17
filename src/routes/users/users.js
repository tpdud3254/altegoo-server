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

const usersRouter = express.Router();

usersRouter.get("/search", asyncWrap(getUserExist));
usersRouter.get("/point", auth, asyncWrap(getUserPoint));

usersRouter.get("/test", auth, asyncWrap(testFunc));

async function testFunc(req, res) {
    //   const {
    // } = req.body;

    // console.log(req.body);
    // const id = req.id;

    const firstOrder = await prisma.user.findMany({
        where: { id },
        select: { order: true, point: { select: { id: true } } },
    });

    if (firstOrder[0].order.length === 0) {
        const point = await prisma.point.update({
            where: { id: firstOrder[0].point.id },
            data: { curPoint: 10000 },
        });

        console.log(point);
    }
}

usersRouter.post("/user", asyncWrap(verifyToken));
usersRouter.post("/create", asyncWrap(createAccount));
usersRouter.post("/login", asyncWrap(login));
usersRouter.post("/password", asyncWrap(setPassword));
usersRouter.post("/edit", auth, asyncWrap(editProfile));

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

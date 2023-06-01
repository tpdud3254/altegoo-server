import { PrismaClient } from "@prisma/client";
import prisma from "../../prisma";
import {
    sendPushToUsers,
    sendPushToUser,
    sendPushToAllUsers,
    getRegionToString,
    deletePushForWorks,
} from "../../utils";

export const pushTest = async (req, res) => {
    // const response = await sendPushToUser(
    //   "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //   "send?",
    //   "send!"
    // );

    // const response = await sendPushToUsers(
    //     [
    //         "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //         "ExponentPushToken[Z1uqJ_NbaqRzNtrec7IytG]",
    //     ],
    //     "send?",
    //     "send!"
    // );

    // const order = await prisma.order.findUnique({
    //     where: {
    //         id: 120,
    //     },
    // });
    // const response = await sendPushToAllUsers("Home?", "Home!", {
    //     screen: "Home",
    //     order,
    // });

    // deletePushForWorks({ id: 101 });

    process.emit("REGIST", {
        msg: `안녕하세요`,
    });

    // const pushResponse = await sendPushToUsers(
    //     [
    //         "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //         "ExponentPushToken[Z1uqJ_NbaqRzNtrec7IytG]",
    //     ],
    //     "작업 요청",
    //     `작업이 등록되었습니다.`,
    //     {
    //         screen: "Home",
    //     }
    // );
};

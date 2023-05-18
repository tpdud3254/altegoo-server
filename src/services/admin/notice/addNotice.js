import prisma from "../../../prisma";
import {
    sendPushToAllUsers,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

export const addNotice = async (req, res) => {
    const { id, title, body, performance } = req.body;

    try {
        const updatedNotice = await prisma.notice.create({
            data: {
                manager: {
                    connect: {
                        id,
                    },
                },
                title,
                body,
                performance,
            },
        });

        if (!updatedNotice) throw new Error("공지 추가에 실패하였습니다.");

        const pushResponse = await sendPushToAllUsers(title, body, {
            screen: "NoticeDetail",
            noticeId: updatedNotice.id,
        });

        if (!pushResponse) console.log("do something");

        res.json(setResponseJson({ updatedNotice }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

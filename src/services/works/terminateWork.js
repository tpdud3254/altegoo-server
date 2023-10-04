import prisma from "../../prisma";
import {
    checkRegistUser,
    sendPushToUser,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const terminateWork = async (req, res) => {
    const { id: orderId } = req.body;
    const id = req.id;

    if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

    try {
        if (await checkRegistUser(orderId, id)) {
            const work = await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: {
                        connect: {
                            id: 6,
                        },
                    },
                },
                include: {
                    registUser: { select: { id: true } },
                    orderReservation: true,
                },
            });

            //TODO: 포인트 작업 수정
            const registUserPoint = await prisma.point.findFirst({
                where: { userId: work.userId },
                select: { curPoint: true },
            });

            const registUser = await prisma.point.update({
                where: { userId: work.userId },
                data: {
                    curPoint: registUserPoint.curPoint + work.registPoint,
                },
            });

            const acceptUserPoint = await prisma.point.findFirst({
                where: { userId: work.acceptUser },
                select: { curPoint: true },
            });

            const acceptUser = await prisma.point.update({
                where: { userId: work.acceptUser },
                data: {
                    curPoint: acceptUserPoint.curPoint + work.totalPrice,
                },
            });

            if (!registUser || !acceptUser) {
                throw new Error(
                    "포인트 변경에 실패했습니다. 관리자에게 문의해주세요."
                );
            }

            sendPushToUser(
                await getUserExpoToken(work.acceptUser),
                "작업이 완료 되었습니다.",
                "포인트가 지급 되었습니다."
            );

            const workList = await prisma.order.findMany({
                include: {
                    registUser: { select: { id: true } },
                    orderReservation: true,
                },
                orderBy: {
                    id: "desc",
                },
                // take: 5,
                // skip: lastUserId ? 1 : 0,
                // ...(lastUserId && { cursor: { id: lastUserId } }),
                //TODO: pagination
            });

            //TODO: 오류나면 원복,,
            res.json(setResponseJson({ list: workList }));
        }
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

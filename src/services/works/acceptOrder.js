import prisma from "../../prisma";
import {
    GetUTCDateTime,
    addPushForWorks,
    getUserExpoToken,
    sendPushToUser,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const acceptOrder = async (req, res) => {
    const { id: orderId } = req.body;
    const id = req.id;

    if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (user?.reservationBlock) {
            throw new Error("예약이 불가합니다. \n고객센터로 문의해주세요.");
        }

        const now = GetUTCDateTime();

        console.log("now : ", now);
        const orders = await prisma.order.findMany({
            where: {
                AND: [
                    { acceptUser: id },
                    { orderStatusId: 2 },
                    { dateTime: { gt: now.toString() } },
                ],
            },
        });

        console.log("my accept list : ", orders.length);

        if (orders.length >= 3) {
            throw new Error("작업 예약은 3개 이하로 가능합니다.");
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            select: {
                orderStatusId: true,
            },
        });

        console.log("order.orderStatusId : ", order.orderStatusId);
        if (order.orderStatusId === 7) throw new Error("취소된 작업입니다.");
        if (order.orderStatusId === 2) throw new Error("예약이 불가합니다.");
        if (order.orderStatusId >= 3)
            throw new Error("이미 시작된 작업입니다.");

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                acceptUser: id,
                status: {
                    connect: {
                        id: 2,
                    },
                },
            },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
        });

        if (!updatedOrder) throw new Error("작업상태 변경에 실패했습니다.");

        addPushForWorks(updatedOrder);

        sendPushToUser(
            await getUserExpoToken(updatedOrder.registUser.id),
            "오더 승인 완료",
            "앱에서 내용을 확인해주세요.",
            { screen: "OrderProgress", orderId: updatedOrder.id }
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

        if (!workList) throw new Error("작업상태 변경에 실패했습니다.");

        //TODO: 리스트 반환,.,?
        res.json(setResponseJson({ list: workList }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { addPushForWorks, setErrorJson, setResponseJson } from "../../utils";

export const acceptOrder = async (req, res) => {
    const { id: orderId } = req.body;
    const id = req.id;

    if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

    try {
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

import prisma from "../../prisma";
import {
    checkRegistUser,
    deletePushForWorks,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const removeOrder = async (req, res) => {
    const { id: orderId } = req.body;
    const id = req.id;

    try {
        if (await checkRegistUser(orderId, id)) {
            const updatedOrder = await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: {
                        connect: {
                            id: 7,
                        },
                    },
                },
                include: {
                    registUser: { select: { id: true } },
                    orderReservation: true,
                },
            });

            if (!updatedOrder) throw new Error("작업상태 변경에 실패했습니다.");

            deletePushForWorks(updatedOrder);

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
        }
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

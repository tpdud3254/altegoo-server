import prisma from "../../prisma";
import { GetUTCDateTime, setErrorJson, setResponseJson } from "../../utils";

export const getRealTimeOrderList = async (req, res) => {
    const id = req.id;

    console.log(id);
    try {
        const order = await prisma.order.findMany({
            where: {
                AND: {
                    // NOT: [{ userId: id }, { isDesignation: true }],
                    OR: [{ orderStatusId: 1 }, { orderStatusId: 2 }],
                },
            },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
            orderBy: {
                dateTime: "asc",
            },
            // take: 5,
            // skip: lastUserId ? 1 : 0,
            // ...(lastUserId && { cursor: { id: lastUserId } }),
            //TODO: pagination
        });

        if (!order) throw new Error("작업리스트 조회에 실패했습니다.");

        const now = GetUTCDateTime();
        const list = [];
        if (order.length > 0) {
            await Promise.all(
                order.map((element) => {
                    const orderDateTime = new Date(element.dateTime);
                    if (orderDateTime > now) list.push(element);
                })
            );
        }

        console.log(order);
        res.json(setResponseJson({ order: list }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

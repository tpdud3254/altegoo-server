import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getMyVBankOrderList = async (req, res) => {
    const id = req.id;

    console.log(id);

    try {
        const order = await prisma.vBankOrder.findMany({
            where: {
                AND: [{ userId: id }, { standBy: true }, { orderStatusId: 1 }],
            },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
            orderBy: {
                dateTime: "desc",
            },
            // take: 5,
            // skip: lastUserId ? 1 : 0,
            // ...(lastUserId && { cursor: { id: lastUserId } }),
            //TODO: pagination
        });

        if (!order) throw new Error("작업리스트 조회에 실패했습니다.");

        console.log("getMyVBankOrderList : ", order);
        res.json(setResponseJson({ order }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

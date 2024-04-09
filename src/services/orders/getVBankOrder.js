import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getVBankOrder = async (req, res) => {
    const { id } = req.query;

    console.log("order id : ", id);

    const orderId = Number(id);
    try {
        const order = await prisma.vBankOrder.findUnique({
            where: { id: orderId },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
        });

        console.log("getVBankOrder : ", order);

        if (!order) throw new Error("오더 조회에 실패했습니다.");

        res.json(setResponseJson({ order }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getOrder = async (req, res) => {
    const { id } = req.query;

    console.log(id);
    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
        });

        if (!order) throw new Error("오더 조회에 실패했습니다.");

        console.log(order);
        res.json(setResponseJson({ order }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

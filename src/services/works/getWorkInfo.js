import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getWorkInfo = async (req, res) => {
    const { id } = req.query;
    try {
        const work = await prisma.order.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
        });

        if (!work) throw new Error("작업 불러오기에 실패하였습니다.");

        res.json(setResponseJson({ work: work }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

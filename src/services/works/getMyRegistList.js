import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getMyRegistList = async (req, res) => {
    const id = req.id;

    try {
        const list = await prisma.order.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                registUser: {
                                    id,
                                },
                            },
                            {
                                orderStatusId: 4,
                            },
                        ],
                    },
                ],
            },
            include: {
                registUser: { select: { userName: true } },
                orderReservation: true,
            },
            orderBy: { id: "desc" },
        });

        console.log(list);
        if (!list) throw new Error("작업 불러오기에 실패하였습니다.");

        res.json(setResponseJson({ list: list }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

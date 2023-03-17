import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getMyAcceptList = async (req, res) => {
    const id = req.id;

    try {
        const list = await prisma.order.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                acceptUser: id,
                            },
                            {
                                orderStatusId: 2,
                            },
                        ],
                    },
                    {
                        AND: [
                            {
                                acceptUser: id,
                            },
                            {
                                orderStatusId: 3,
                            },
                        ],
                    },
                ],
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

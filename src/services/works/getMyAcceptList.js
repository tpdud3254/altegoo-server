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

        const result = [];

        if (list.length > 0) {
            list.map((order, index) => {
                const workDateTime = new Date(workDateTime);
                const today = Date.now();
                console.log(workDateTime);
                console.log(today);
                if (workDateTime < today) {
                    result.push(order);
                }
            });
        }
        console.log(result);
        if (!list) throw new Error("작업 불러오기에 실패하였습니다.");

        res.json(setResponseJson({ list: result }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

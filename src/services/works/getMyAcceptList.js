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
                const workDateTime = new Date(order.workDateTime);
                const today = new Date();
                today.setDate(today.getDate() + 1);
                console.log(workDateTime.getDate());
                console.log(today.getDate());
                if (workDateTime < today) {
                    console.log(order);
                    result.push(order);
                } else {
                    console.log("else");
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

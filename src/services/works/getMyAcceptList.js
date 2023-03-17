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
            include: {
                registUser: { select: { userName: true } },
                orderReservation: true,
            },
            orderBy: { id: "desc" },
        });

        let result = [];

        if (list.length > 0) {
            list.map((order, index) => {
                const workDateTime = new Date(order.workDateTime);
                const today = new Date();
                today.setDate(today.getDate() + 1);
                console.log(
                    `${workDateTime.getMonth()}-${workDateTime.getDate()} : ${
                        order.orderStatusId
                    }`
                );
                console.log(`${today.getMonth()}-${today.getDate()}`);
                if (workDateTime > today) {
                    if (
                        order.orderStatusId === 2 &&
                        workDateTime.getMonth() === today.getMonth() &&
                        workDateTime.getDate() === today.getDate()
                    ) {
                        //오늘 날짜
                        // result.push(order);
                        result = [order, ...result];
                        console.log(order);
                    } else if (
                        order.orderStatusId === 3 &&
                        workDateTime.getMonth() === today.getMonth() &&
                        workDateTime.getDate() === today.getDate() &&
                        workDateTime.getHours() + 1 <= today.getHours()
                    )
                        result.push(order);
                    else console.log("eles");
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

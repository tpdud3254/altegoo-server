import prisma from "../../prisma";
import { GetCurrentDateTime, setErrorJson, setResponseJson } from "../../utils";

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
                    {
                        AND: [
                            {
                                acceptUser: id,
                            },
                            {
                                orderStatusId: 4,
                            },
                        ],
                    },
                ],
            },
            include: {
                registUser: { select: { id: true } },
                orderReservation: true,
            },
            orderBy: { dateTime: "desc" },
        });

        let result = [];

        async function getTodayList() {
            const today = await Promise.all(
                list.map((order, index) => {
                    const dateTime = new Date(order.dateTime);
                    const today = GetCurrentDateTime();
                    today.setUTCDate(today.getUTCDate() + 1);
                    console.log(
                        `${dateTime.getUTCMonth()}-${dateTime.getUTCDate()} : ${
                            order.orderStatusId
                        }`
                    );
                    console.log(`${today.getUTCMonth()}-${today.getUTCDate()}`);
                    if (
                        (order.orderStatusId === 2 &&
                            dateTime.getUTCMonth() === today.getUTCMonth() &&
                            dateTime.getUTCDate() === today.getUTCDate()) ||
                        (order.orderStatusId === 2 && dateTime < today)
                    )
                        //오늘 날짜
                        result.push(order);
                    else if (
                        (order.orderStatusId === 3 &&
                            dateTime.getUTCMonth() === today.getUTCMonth() &&
                            dateTime.getUTCDate() === today.getUTCDate()) ||
                        (order.orderStatusId === 3 && dateTime < today)
                    )
                        //오늘 날짜
                        result.push(order);
                    else if (
                        order.orderStatusId === 4 &&
                        dateTime.getUTCMonth() === today.getUTCMonth() &&
                        dateTime.getUTCDate() === today.getUTCDate() &&
                        dateTime.getUTCHours() + 1 <= today.getUTCHours()
                    )
                        result.push(order);
                    else console.log("eles");
                })
            );
        }

        if (list.length > 0) {
            await getTodayList();
        }
        console.log("getTodayList: ", result);
        if (!list) throw new Error("작업 불러오기에 실패하였습니다.");

        res.json(setResponseJson({ list: result }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

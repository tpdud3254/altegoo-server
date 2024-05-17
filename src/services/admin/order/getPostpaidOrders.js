import prisma from "../../../prisma";
import { GetUTCDateTime, setErrorJson, setResponseJson } from "../../../utils";

const getPostpaidOrders = async (req, res) => {
    const { orderStatus, startDate, endDate, calculate } = req.query;

    try {
        const orders = await prisma.order.findMany({
            where: {
                AND: [
                    { OR: [{ paymentType: 1 }, { paymentType: 2 }] },
                    {
                        ...(orderStatus &&
                            orderStatus === "2" && {
                                OR: [
                                    { orderStatusId: 2 },
                                    { orderStatusId: 3 },
                                ],
                            }),
                        ...(orderStatus &&
                            orderStatus === "6" && {
                                OR: [
                                    { orderStatusId: 7 },
                                    { orderStatusId: 8 },
                                ],
                            }),
                        ...(orderStatus &&
                            orderStatus === "1" && {
                                orderStatusId: 1,
                            }),
                        ...(orderStatus &&
                            orderStatus !== "2" &&
                            orderStatus !== "6" &&
                            orderStatus !== "1" && {
                                orderStatusId: Number(orderStatus) + 1,
                            }),
                        ...(calculate &&
                            calculate === "1" && {
                                isCalculated: false,
                            }),
                        ...(calculate &&
                            calculate === "2" && {
                                isCalculated: true,
                            }),
                    },
                ],
            },
            include: {
                registUser: true,
            },
            orderBy: { createdAt: "desc" },
        });

        let filterdWithDate = null;

        if (startDate && endDate) {
            filterdWithDate = orders.filter((value) => {
                const datetime = new Date(value.paymentDate);

                const start = GetUTCDateTime(startDate);
                const end = GetUTCDateTime(endDate);

                return datetime >= start && datetime <= end;
            });
        } else {
            filterdWithDate = orders;
        }

        const sortedList = filterdWithDate.sort((a, b) => {
            const datetime1 = GetUTCDateTime(a.createdAt);
            const datetime2 = GetUTCDateTime(b.createdAt);

            if (datetime1 < datetime2) return 1;
            if (datetime1 > datetime2) return -1;
            return 0;
        });

        // console.log("sorted : ", sortedList);
        async function getUsers() {
            const usersList = await Promise.all(
                sortedList.map(async (order, index) => {
                    if (!order.acceptUser) return;
                    const user = await prisma.user.findUnique({
                        where: { id: order.acceptUser },
                        select: { name: true },
                    });
                    sortedList[index] = {
                        ...sortedList[index],
                        ...{
                            acceptUserName:
                                user && user.name ? user.name : null,
                        },
                    };
                })
            );
        }

        await getUsers();

        if (!sortedList) throw new Error("유저 리스트를 불러올 수 없습니다.");

        res.json(setResponseJson({ orders: sortedList }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getPostpaidOrders;

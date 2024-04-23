import prisma from "../../../prisma";
import {
    GetDateTime,
    GetUTCDateTime,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

const getOrders = async (req, res) => {
    const {
        orderId,
        acceptUser,
        registUser,
        orderStatus,
        orderType,
        region,
        startDate,
        endDate,
    } = req.query;

    try {
        let acceptUserData = null;

        if (acceptUser) {
            acceptUserData = await prisma.user.findUnique({
                where: { id: Number(acceptUser) },
            });
        }

        const orders = await prisma.order.findMany({
            where: {
                ...(orderId && { id: Number(orderId) }),
                ...((acceptUser || acceptUserData) && {
                    acceptUser: Number(acceptUserData.id),
                }),
                ...(registUser && {
                    registUser: {
                        name: registUser,
                    },
                }),
                ...(orderType && { vehicleType: orderType }),
                ...(orderStatus &&
                    orderStatus === "2" && {
                        OR: [{ orderStatusId: 2 }, { orderStatusId: 3 }],
                    }),
                ...(orderStatus &&
                    orderStatus === "6" && {
                        OR: [{ orderStatusId: 7 }, { orderStatusId: 8 }],
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
                ...(region && {
                    address1: { contains: region.toString() },
                }),
            },
            include: {
                registUser: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const vBankOrders = await prisma.vBankOrder.findMany({
            where: {
                AND: [{ standBy: true }, { orderStatusId: 1 }],
                ...(orderId && { id: Number(orderId) }),
                ...((acceptUser || acceptUserData) && {
                    acceptUser: Number(acceptUserData.id),
                }),
                ...(registUser && {
                    registUser: {
                        name: registUser,
                    },
                }),
                ...(orderType && { vehicleType: orderType }),
                ...(region && {
                    address1: { contains: region.toString() },
                }),
            },
            include: {
                registUser: true,
            },
            orderBy: { createdAt: "desc" },
        });

        let originalList = null;

        if (orderStatus && orderStatus === "7") {
            originalList = [...vBankOrders];
        } else {
            originalList = [...orders, ...vBankOrders];
        }

        let filterdWithDate = null;

        if (startDate && endDate) {
            filterdWithDate = originalList.filter((value) => {
                const datetime = GetDateTime(value.dateTime);
                const start = GetUTCDateTime(startDate);
                const end = GetUTCDateTime(endDate);

                return datetime >= start && datetime < end;
            });
        } else {
            filterdWithDate = originalList;
        }

        const sortedList = filterdWithDate.sort((a, b) => {
            const datetime1 = GetUTCDateTime(a.createdAt);
            const datetime2 = GetUTCDateTime(b.createdAt);

            if (datetime1 < datetime2) return 1;
            if (datetime1 > datetime2) return -1;
            return 0;
        });

        console.log("sorted : ", sortedList);
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

export default getOrders;

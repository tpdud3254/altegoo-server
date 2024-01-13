import prisma from "../../../prisma";
import { GetPlusDateTime, setErrorJson, setResponseJson } from "../../../utils";

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
                ...(startDate &&
                    endDate && {
                        AND: [
                            { dateTime: { gt: GetPlusDateTime(startDate) } },
                            { dateTime: { lt: GetPlusDateTime(endDate) } },
                        ],
                    }),
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
            orderBy: { id: "desc" },
        });

        async function getUsers() {
            const usersList = await Promise.all(
                orders.map(async (order, index) => {
                    if (!order.acceptUser) return;
                    const user = await prisma.user.findUnique({
                        where: { id: order.acceptUser },
                        select: { name: true },
                    });
                    orders[index] = {
                        ...orders[index],
                        ...{
                            acceptUserName:
                                user && user.name ? user.name : null,
                        },
                    };
                })
            );
        }

        await getUsers();

        if (!orders) throw new Error("유저 리스트를 불러올 수 없습니다.");

        res.json(setResponseJson({ orders: orders }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getOrders;

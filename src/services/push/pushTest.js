import prisma from "../../prisma";
import {
    sendPushToUsers,
    sendPushToUser,
    sendPushToAllUsers,
} from "../../utils";

export const pushTest = async (req, res) => {
    // const response = await sendPushToUser(
    //   "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //   "send?",
    //   "send!"
    // );

    // const response = await sendPushToUsers(
    //     [
    //         "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //         "ExponentPushToken[Z1uqJ_NbaqRzNtrec7IytG]",
    //     ],
    //     "send?",
    //     "send!"
    // );

    // const response = await sendPushToAllUsers("send?", "send!");

    const now = new Date();

    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { orderStatusId: 2 },
                { orderStatusId: 3 },
                { orderStatusId: 4 },
                { orderStatusId: 5 },
            ],
        },
        orderBy: {
            orderStatusId: "asc",
        },
    });

    // console.log(orders);

    const before10Mins = [];
    const before2Hours = [];
    const before12Hours = [];
    const before24Hours = [];

    const afterWorkDateTime1 = [];
    const afterWorkDateTime2 = [];

    orders.map((order) => {
        const orderDate = new Date(order.workDateTime);

        if (now < orderDate) {
            if (order.orderStatusId === 2) {
                const compareDate = new Date(orderDate);

                //10분 전
                compareDate.setMinutes(orderDate.getMinutes() - 10);
                if (compareDate < now) {
                    console.log(
                        "0시 00지역의 작업이 10분 뒤 시작될 예정입니다. / userId : ",
                        order.acceptUser
                    );
                    return;
                }

                //2시간 전
                compareDate.setHours(orderDate.getHours() - 2);
                if (compareDate < now) {
                    console.log(
                        "0시 00지역의 작업이 2시간 뒤 시작될 예정입니다. / userId : ",
                        order.acceptUser
                    );
                    return;
                }

                //12시간 전
                compareDate.setHours(orderDate.getHours() - 12);
                if (compareDate < now) {
                    console.log(
                        "0시 00지역의 작업이 12시간 뒤 시작될 예정입니다. / userId : ",
                        order.acceptUser
                    );
                    return;
                }

                //24시간 전
                compareDate.setHours(orderDate.getHours() - 24);
                if (compareDate < now) {
                    console.log(
                        "0시 00지역의 작업이 24시간 뒤 시작될 예정입니다. / userId : ",
                        order.acceptUser
                    );
                    return;
                }
            }
        } else {
            const compareDate = new Date(now);
            compareDate.setHours(compareDate.getHours() - 5);

            if (compareDate <= orderDate) {
                if (order.orderStatusId === 2 || order.orderStatusId === 3) {
                    console.log(
                        "작업 시작을 누르고 작업을 시작해 주세요. / userId : ",
                        order.acceptUser
                    );
                }
            } else {
                if (order.orderStatusId === 3 || order.orderStatusId === 4) {
                    console.log(
                        "작업 진행 중 이신가요? 작업이 완료되면 작업 완료를 눌러주세요. / userId : ",
                        order.acceptUser
                    );
                }
            }
        }
    });
};

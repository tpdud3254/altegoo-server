import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const setWorkStatus = async (req, res) => {
    const { id: orderId, status } = req.body;
    const id = req.id;
    console.log(id, status);

    if (!orderId || !status || !id)
        throw new Error("작업 상태를 변경할 수 없습니다.");

    try {
        if (status === 1) {
            //예약 중 -> 요청 중으로 변경 전 예약 대기 있는지 확인하고 있으면 예약대기중인 사람이 예약하기
            const reservation = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
                select: {
                    orderReservation: true,
                },
            });

            if (reservation.orderReservation.length > 0) {
                //해당 작업에 예약 대기중인 사람이 있을 경우
                const work = await prisma.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        acceptUser: reservation.orderReservation[0].userId,
                    },
                });

                if (!work) throw new Error("작업상태 변경에 실패했습니다.");

                const deleteResult = await prisma.orderReservation.delete({
                    where: { id: reservation.orderReservation[0].id },
                });

                if (!deleteResult)
                    throw new Error("작업상태 변경에 실패했습니다.");

                const workList = await prisma.order.findMany({
                    include: {
                        registUser: { select: { userName: true } },
                        orderReservation: true,
                    },
                    orderBy: {
                        id: "desc",
                    },
                    // take: 5,
                    // skip: lastUserId ? 1 : 0,
                    // ...(lastUserId && { cursor: { id: lastUserId } }),
                    //TODO: pagination
                });

                if (!workList) throw new Error("작업상태 변경에 실패했습니다.");

                res.json(setResponseJson({ list: workList }));

                //TODO: 새 예약자한테 알림

                return;
            } else {
                //예약대기가 없을 경우 그냥 삭제
                const work = await prisma.order.update({
                    where: {
                        id: orderId,
                    },
                    data: {
                        acceptUser: null,
                        status: {
                            connect: {
                                id: status,
                            },
                        },
                    },
                });

                if (!work) throw new Error("작업상태 변경에 실패했습니다.");

                const workList = await prisma.order.findMany({
                    include: {
                        registUser: { select: { userName: true } },
                        orderReservation: true,
                    },
                    orderBy: {
                        id: "desc",
                    },
                    // take: 5,
                    // skip: lastUserId ? 1 : 0,
                    // ...(lastUserId && { cursor: { id: lastUserId } }),
                    //TODO: pagination
                });

                if (!workList) throw new Error("작업상태 변경에 실패했습니다.");

                res.json(setResponseJson({ list: workList }));

                return;
            }
        }

        const work = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                acceptUser: id,
                status: {
                    connect: {
                        id: status,
                    },
                },
            },
        });

        if (!work) throw new Error("작업상태 변경에 실패했습니다.");

        const workList = await prisma.order.findMany({
            include: {
                registUser: { select: { userName: true } },
                orderReservation: true,
            },
            orderBy: {
                id: "desc",
            },
            // take: 5,
            // skip: lastUserId ? 1 : 0,
            // ...(lastUserId && { cursor: { id: lastUserId } }),
            //TODO: pagination
        });

        if (!workList) throw new Error("작업상태 변경에 실패했습니다.");

        res.json(setResponseJson({ list: workList }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import {
    GetCurrentDateTime,
    checkRegistUser,
    getUserExpoToken,
    sendPushToUser,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const terminateWork = async (req, res) => {
    const { id: orderId } = req.body;
    const id = req.id;

    if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

    try {
        if (await checkRegistUser(orderId, id)) {
            const work = await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: {
                        connect: {
                            id: 6,
                        },
                    },
                },
                include: {
                    registUser: { select: { id: true } },
                    orderReservation: true,
                },
            });

            //첫 등록시 포인트 적립
            // const firstOrder = await prisma.user.findUnique({
            //     where: { id: work.userId },
            //     select: {
            //         order: true,
            //         point: { select: { id: true, curPoint: true } },
            //     },
            // });

            // console.log("firstOrder.order.length : ", firstOrder.order.length);

            // if (firstOrder.order.length === 1) {
            //     const point = await prisma.point.update({
            //         where: { id: firstOrder.point.id },
            //         data: { curPoint: firstOrder.point.curPoint + 10000 },
            //     });

            //     const firstOrderPointBreakdown =
            //         await prisma.pointBreakdown.create({
            //             data: {
            //                 content: "최초 1회 작업 등록 포인트 적립",
            //                 type: "적립",
            //                 point: 10000,
            //                 restPoint: firstOrder.point.curPoint + 10000,
            //                 user: {
            //                     connect: {
            //                         id: work.userId,
            //                     },
            //                 },
            //                 date: GetCurrentDateTime(),
            //             },
            //         });
            // }

            //작업등록포인트 적립
            const registUserPoint = await prisma.point.findFirst({
                where: { userId: work.userId },
                select: { curPoint: true },
            });

            const registUser = await prisma.point.update({
                where: { userId: work.userId },
                data: {
                    curPoint: registUserPoint.curPoint + work.registPoint,
                },
            });

            const registUserPointBreakdown = await prisma.pointBreakdown.create(
                {
                    data: {
                        content: "작업 등록 포인트 적립",
                        type: "적립",
                        point: work.registPoint,
                        restPoint: registUser.curPoint,
                        user: {
                            connect: {
                                id: work.userId,
                            },
                        },
                        date: GetCurrentDateTime(),
                    },
                }
            );

            //작업완료포인트 적립
            const acceptUserPoint = await prisma.point.findFirst({
                where: { userId: work.acceptUser },
                select: { curPoint: true },
            });

            const acceptUser = await prisma.point.update({
                where: { userId: work.acceptUser },
                data: {
                    curPoint: acceptUserPoint.curPoint + work.orderPoint,
                },
            });

            const acceptUserPointBreakdown = await prisma.pointBreakdown.create(
                {
                    data: {
                        content: "작업 완료 포인트 적립",
                        type: "적립",
                        point: work.orderPoint,
                        restPoint: acceptUser.curPoint,
                        user: {
                            connect: {
                                id: work.acceptUser,
                            },
                        },
                        date: GetCurrentDateTime(),
                    },
                }
            );

            //추천인포인트 적립
            const recommendUser = await prisma.user.findFirst({
                where: { id: work.userId },
                select: { recommendUserId: true },
            });
            console.log("recommendUser : ", recommendUser);
            //추천회원이 있거나 알테구 계정이 아닐 때 적립
            if (
                recommendUser &&
                recommendUser.recommendUserId &&
                recommendUser.recommendUserId !== 1
            ) {
                const recommendUserPoint = await prisma.point.findFirst({
                    where: { userId: recommendUser.recommendUserId },
                });

                if (recommendUserPoint !== null) {
                    const updateRecommendUserPoint = await prisma.point.update({
                        where: { userId: recommendUser.recommendUserId },
                        data: {
                            curPoint:
                                recommendUserPoint.curPoint +
                                work.recommendationPoint,
                        },
                    });

                    const recommendUserPointBreakdown =
                        await prisma.pointBreakdown.create({
                            data: {
                                content: "추천인 포인트 적립",
                                type: "적립",
                                point: work.recommendationPoint,
                                restPoint: updateRecommendUserPoint.curPoint,
                                user: {
                                    connect: {
                                        id: recommendUser.recommendUserId,
                                    },
                                },
                                date: GetCurrentDateTime(),
                            },
                        });
                }
            }

            if (!registUser || !acceptUser) {
                throw new Error(
                    "포인트 변경에 실패했습니다. 관리자에게 문의해주세요."
                );
            }

            sendPushToUser(
                await getUserExpoToken(work.acceptUser),
                "작업 완료",
                "작업이 완료 되었습니다."
            );

            const workList = await prisma.order.findMany({
                include: {
                    registUser: { select: { id: true } },
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

            //TODO: 오류나면 원복,,
            res.json(setResponseJson({ list: workList }));
        }
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

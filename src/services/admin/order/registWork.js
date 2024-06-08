import prisma from "../../../prisma";
import {
    GetCommissionList,
    getUserExpoToken,
    sendPushToUser,
    sendPushToUsers,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

export const registWork = async (req, res) => {
    const {
        direction,
        floor,
        volume,
        downFloor,
        upFloor,
        quantity,
        time,
        paymentType,
        paymentDate,
        registUser,
        phone,
        vehicleType,
        dateTime,
        address1,
        address2,
        detailAddress1,
        detailAddress2,
        simpleAddress1,
        simpleAddress2,
        region,
        latitude,
        longitude,
        directPhone,
        emergency,
        memo,
        isDesignation,
        driverId,
        price,
        emergencyPrice,
        usePoint,
        orderPrice,
        totalPrice,
        tax,
        finalPrice,
        gugupackPrice,
        method,
        push,
    } = req.body;

    console.log("registWork body : ", req.body);

    const id = registUser;

    const commissionList = await GetCommissionList();

    const recommendationPoint = orderPrice * commissionList.recommendationPoint;

    let registPoint = orderPrice * commissionList.registPoint;
    let orderPoint =
        finalPrice -
        finalPrice * commissionList.cardCommission -
        recommendationPoint -
        registPoint;

    if (Number(gugupackPrice) > 0) {
        if (registPoint - 10000 < 0) {
            orderPoint = orderPoint + registPoint;
            registPoint = 0;
        } else {
            registPoint = registPoint - 10000;
            orderPoint = orderPoint + 10000;
        }
    }

    try {
        //작업등록
        const regist = await prisma.order.create({
            data: {
                registUser: { connect: { id } },
                vehicleType,
                direction,
                floor,
                downFloor,
                upFloor,
                volume,
                time,
                quantity,
                dateTime,
                address1,
                detailAddress1,
                simpleAddress1,
                address2,
                detailAddress2,
                simpleAddress2,
                region: { connect: { id: region } },
                latitude,
                longitude,
                phone,
                directPhone,
                emergency,
                memo,
                price,
                emergencyPrice,
                usePoint,
                orderPrice,
                totalPrice,
                gugupackPrice,
                tax,
                finalPrice,
                recommendationPoint: Math.floor(recommendationPoint),
                registPoint: Math.floor(registPoint),
                orderPoint: Math.floor(orderPoint),
                method,
                status: { connect: { id: 1 } },
                isDesignation: isDesignation,
                paymentDate,
                paymentType,
                cardCommission: commissionList.cardCommission,
            },
        });

        if (!regist) throw new Error("작업 등록에 실패하였습니다.");

        //사용한 포인트 차감
        //TODO: 다음에 내역 추가
        const setPoint =
            usePoint &&
            usePoint > 0 &&
            (await prisma.point.update({
                where: { id: firstOrder.point.id },
                data: { curPoint: firstOrder.point.curPoint - usePoint },
            }));

        console.log("setPoint : ", setPoint);

        if (!setPoint && setPoint !== 0)
            //TODO: 대응
            throw new Error("작업 등록에 실패하였습니다.");

        const pushCannel =
            vehicleType === "사다리차" ? "ladder_push" : "sky_push";

        if (isDesignation) {
            const result = await prisma.order.update({
                where: {
                    id: regist.id,
                },
                data: {
                    acceptUser: driverId,
                    orderStatusId: 2,
                },
            });

            sendPushToUser(
                await getUserExpoToken(driverId),
                "지정 작업 요청",
                "지정 작업이 등록되었습니다. 앱에서 확인해주세요.",
                { screen: "DriverOrderProgress", orderId: regist.id },
                pushCannel
            );
        } else {
            const orderTime = new Date(dateTime);

            if (emergency) {
                //tts 알림
                // process.emit("REGIST", {
                //     msg: `긴급 작업이 등록되었습니다.            ${
                //         orderTime.getUTCMonth() + 1
                //     }월 ${orderTime.getUTCDate()}일 ${orderTime.getUTCHours()}시 ${orderTime.getUTCMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                //     userId: id,
                //     orderId: regist.id,
                // });
            } else {
                if (push) {
                    //tts 알림
                    // process.emit("REGIST", {
                    //     msg: `${
                    //         orderTime.getUTCMonth() + 1
                    //     }월 ${orderTime.getUTCDate()}일 ${orderTime.getUTCHours()}시 ${orderTime.getUTCMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                    //     userId: id,
                    //     orderId: regist.id,
                    // });

                    //푸시 알림
                    const users = await prisma.user.findMany({
                        where: {
                            AND: [
                                {
                                    NOT: {
                                        userTypeId: 1,
                                    }, //일반회원 제외
                                },
                                {
                                    NOT: {
                                        userTypeId: 3,
                                    }, //기업회원 제외
                                },
                                {
                                    NOT: {
                                        id, //자기 자신 제외
                                    },
                                },
                            ],
                        },
                        select: {
                            id: true,
                            pushToken: true,
                            workRegion: true,
                        },
                    });

                    console.log("push user : ", users);

                    const expoTokenList = [];

                    if (emergency) {
                        // users.map((value, index) => {
                        //     if (value.pushToken)
                        //         expoTokenList.push(value.pushToken);
                        // });
                        // console.log("expoTokenList : ", expoTokenList);
                        // const pushResponse = await sendPushToUsers(
                        //     expoTokenList,
                        //     "긴급 작업 요청",
                        //     `${
                        //         orderTime.getUTCMonth() + 1
                        //     }월 ${orderTime.getUTCDate()}일 ${orderTime.getUTCHours()}시 ${orderTime.getUTCMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                        //     {
                        //         type: "REGIST",
                        //         screen: "OrderDetails",
                        //         // order: regist,
                        //         userId: id,
                        //         orderId: regist.id,
                        //     },
                        //     pushCannel
                        // );
                        // console.log(pushResponse);
                    } else {
                        users.map((value, index) => {
                            //TODO: 작업 지역에 따라 울리기
                            // if (value.workRegion.length > 0) {
                            //     let correctRegion = false;

                            //     value.workRegion.map((region) => {
                            //         if (region.id === region) correctRegion = true;
                            //     });

                            //     if (correctRegion) {
                            //         if (value.pushToken)
                            //             expoTokenList.push(value.pushToken);
                            //     }
                            // }
                            if (value.pushToken)
                                expoTokenList.push(value.pushToken);
                        });

                        console.log("expoTokenList : ", expoTokenList);
                        const pushResponse = await sendPushToUsers(
                            expoTokenList,
                            "작업 요청",
                            `${
                                orderTime.getUTCMonth() + 1
                            }월 ${orderTime.getUTCDate()}일 ${orderTime.getUTCHours()}시 ${orderTime.getUTCMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                            {
                                screen: "OrderDetails",
                                orderId: regist.id,
                            },
                            pushCannel
                        );

                        console.log(pushResponse);
                    }
                }
            }
        }

        res.json(setResponseJson({ order: regist }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

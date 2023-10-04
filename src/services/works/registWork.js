import prisma from "../../prisma";
import { sendPushToUsers, setErrorJson, setResponseJson } from "../../utils";

export const registWork = async (req, res) => {
    const {
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
        address2,
        detailAddress1,
        detailAddress2,
        simpleAddress1,
        simpleAddress2,
        region,
        latitude,
        longitude,
        phone,
        directPhone,
        memo,
        emergency,
        price,
        emergencyPrice,
        usePoint,
        orderPrice,
        totalPrice,
        tax,
        finalPrice,
        registPoint,
    } = req.body;

    console.log(req.body);

    const id = req.id;

    try {
        //첫 등록시 포인트
        const firstOrder = await prisma.user.findUnique({
            where: { id },
            select: {
                order: true,
                point: { select: { id: true, curPoint: true } },
            },
        });

        console.log("firstOrder.order.length : ", firstOrder.order.length);

        if (firstOrder.order.length === 0) {
            const point = await prisma.point.update({
                where: { id: firstOrder.point.id },
                data: { curPoint: firstOrder.point.curPoint + 10000 },
            });
        }

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
                tax,
                finalPrice,
                recommendationPoint: orderPrice * 0.02,
                registPoint,
                orderPoint: orderPrice * 1.1 - orderPrice * 0.02 - registPoint,
                status: { connect: { id: 1 } },
            },
        });

        if (!regist) throw new Error("작업 등록에 실패하였습니다.");

        const setPoint =
            usePoint &&
            usePoint > 0 &&
            (await prisma.point.update({
                where: { id: firstOrder.point.id },
                data: { curPoint: firstOrder.point.curPoint - usePoint },
            }));

        console.log("setPoint : ", setPoint);

        if (!setPoint && setPoint !== 0)
            throw new Error("작업 등록에 실패하였습니다.");
        //TODO: 대응

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

        const orderTime = new Date(dateTime);

        const expoTokenList = [];

        if (emergency) {
            users.map((value, index) => {
                expoTokenList.push(value.pushToken);
            });

            const pushResponse = await sendPushToUsers(
                expoTokenList,
                "긴급 작업 요청",
                `${orderTime.getHours()}시 ${orderTime.getMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                {
                    screen: "OrderDetails",
                    order: regist,
                }
            );

            console.log(pushResponse);
        } else {
            users.map((value, index) => {
                if (value.workRegion.length > 0) {
                    let correctRegion = false;

                    value.workRegion.map((region) => {
                        if (region.id === region) correctRegion = true;
                    });

                    if (correctRegion) {
                        expoTokenList.push(value.pushToken);
                    }
                }
            });

            const pushResponse = await sendPushToUsers(
                expoTokenList,
                "작업 요청",
                `${orderTime.getHours()}시 ${orderTime.getMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                {
                    screen: "Home",
                }
            );

            console.log(pushResponse);
        }

        //TODO: 푸시한 뒤 일정시간 지난뒤 에 해보기
        if (emergency) {
            process.emit("REGIST", {
                msg: `긴급 작업이 등록되었습니다.            ${orderTime.getHours()}시 ${orderTime.getMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                userId: id,
            });
        } else {
            process.emit("REGIST", {
                msg: `${orderTime.getHours()}시 ${orderTime.getMinutes()}분 ${simpleAddress1}에 작업이 등록되었습니다.`,
                userId: id,
            });
        }

        res.json(setResponseJson({ order: regist }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

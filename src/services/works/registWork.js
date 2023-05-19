import prisma from "../../prisma";
import { sendPushToUsers, setErrorJson, setResponseJson } from "../../utils";

export const registWork = async (req, res) => {
    const {
        workDateTime,
        type,
        bothType,
        address1,
        detailAddress1,
        simpleAddress1,
        address2,
        detailAddress2,
        simpleAddress2,
        regionId,
        floor,
        otherFloor,
        phone,
        directPhone,
        price,
        point,
        volumeType,
        quantity,
        time,
        vehicleType,
        emergency,
        memo,
    } = req.body;

    console.log(req.body);

    const id = req.id;

    try {
        //첫 등록시 포인트
        const firstOrder = await prisma.user.findMany({
            where: { id },
            select: {
                order: true,
                point: { select: { id: true, curPoint: true } },
            },
        });

        if (firstOrder[0].order.length === 0) {
            const point = await prisma.point.update({
                where: { id: firstOrder[0].point.id },
                data: { curPoint: firstOrder[0].point.curPoint + 10000 },
            });
        }

        const regist = await prisma.order.create({
            data: {
                registUser: { connect: { id } },
                workDateTime,
                type,
                bothType,
                address: "",
                address1,
                detailAddress1,
                simpleAddress1,
                address2,
                detailAddress2,
                simpleAddress2,
                region: { connect: { id: regionId } },
                floor,
                otherFloor,
                phone,
                directPhone,
                price,
                point,
                volumeType,
                quantity,
                time,
                vehicleType,
                emergency,
                memo,
                status: { connect: { id: 1 } },
            },
        });
        console.log(regist);

        if (!regist) throw new Error("작업 등록에 실패하였습니다.");

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            userTypeId: 7,
                        }, //일반회원 제외
                    },
                    {
                        NOT: {
                            id, //자기 자신 제외
                        },
                    },
                    {
                        NOT: {
                            pushToken: "none",
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

        const orderTime = new Date(workDateTime);

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
                    screen: "OrderDetail",
                    order: regist,
                }
            );

            console.log(pushResponse);
        } else {
            users.map((value, index) => {
                if (value.workRegion.length > 0) {
                    let correctRegion = false;

                    value.workRegion.map((region) => {
                        if (region.id === regionId) correctRegion = true;
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

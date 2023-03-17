import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const registWork = async (req, res) => {
    const {
        workDateTime,
        type,
        bothType,
        address1,
        simpleAddress1,
        address2,
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
                simpleAddress1,
                address2,
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

        const orderTime = new Date(workDateTime);
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

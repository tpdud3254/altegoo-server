import prisma from "../../../prisma";
import { GetUTCDateTime, setErrorJson, setResponseJson } from "../../../utils";

export const remitPoints = async (req, res) => {
    const { pointId, remitPoint, curPoint, type, remitUserPhone } = req.body;

    console.log(pointId, remitPoint, curPoint, type, remitUserPhone);
    try {
        const remitUser = await prisma.user.findUnique({
            where: {
                phone: remitUserPhone,
            },
            select: {
                point: true,
            },
        });

        if (!remitUser) throw new Error("포인트 변경에 실패하였습니다.");

        if (curPoint - remitPoint < 0)
            throw new Error("포인트 변경에 실패하였습니다.");

        const typeText = "송금";

        //포인트 변경
        const result1 = await prisma.point.update({
            where: { id: pointId },
            data: {
                curPoint: Number(curPoint) - Number(remitPoint),
            },
        });

        const result2 = await prisma.point.update({
            where: { id: remitUser.point.id },
            data: {
                curPoint: Number(remitUser.point.curPoint) + Number(remitPoint),
            },
        });

        if (!result1 || !result2)
            throw new Error("포인트 변경에 실패하였습니다.");

        //포인트 송금 내역
        const pointBreakdown1 = await prisma.pointBreakdown.create({
            data: {
                content: "포인트 송금",
                type: typeText,
                point: Number(remitPoint),
                restPoint: Number(curPoint) - Number(remitPoint),
                user: {
                    connect: {
                        id: result1.userId,
                    },
                },
                date: GetUTCDateTime(),
            },
        });

        const pointBreakdown2 = await prisma.pointBreakdown.create({
            data: {
                content: "포인트 입금",
                type: typeText,
                point: Number(remitPoint),
                restPoint:
                    Number(remitUser.point.curPoint) + Number(remitPoint),
                user: {
                    connect: {
                        id: result2.userId,
                    },
                },
                date: GetUTCDateTime(),
            },
        });

        res.json(
            setResponseJson({
                points: result1,
                pointBreakdown: pointBreakdown1,
            })
        );
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

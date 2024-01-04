import prisma from "../../prisma";
import { GetCurrentDateTime, setErrorJson, setResponseJson } from "../../utils";

const COMMISSION = 1000;
export const withdrawalPoints = async (req, res) => {
    const { pointId, curPoint, withdrawalPoint } = req.body;

    const id = req.id;
    try {
        const orderCount = await prisma.order.count({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                userId: id,
                            },
                            { orderStatusId: 6 },
                        ],
                    },
                    {
                        AND: [
                            {
                                acceptUser: id,
                            },
                            { orderStatusId: 6 },
                        ],
                    },
                ],
            },
        });

        console.log("user id : ", id);
        console.log("withdrwal point orderCount : ", orderCount);
        if (orderCount <= 0) {
            throw new Error(
                "가입 시 지급된 포인트는 최초 1회 작업 완료 시 출금이 가능합니다."
            );
        }

        //포인트 출금
        const result = await prisma.point.update({
            where: { id: pointId },
            data: { curPoint: curPoint - withdrawalPoint - COMMISSION },
        });

        console.log(result);

        if (!result) throw new Error("포인트 변경에 실패하였습니다.");

        //포인트 출금 내역
        const pointBreakdown = await prisma.pointBreakdown.create({
            data: {
                content: "포인트 출금",
                type: "출금",
                point: Number(withdrawalPoint),
                restPoint: curPoint - withdrawalPoint,
                user: {
                    connect: {
                        id: id,
                    },
                },
                date: GetCurrentDateTime(),
            },
        });

        //포인트 출금 수수료 내역
        const commissionBreakdown = await prisma.pointBreakdown.create({
            data: {
                content: "포인트 출금 수수료 차감",
                type: "차감",
                point: COMMISSION,
                restPoint: curPoint - withdrawalPoint - COMMISSION,
                user: {
                    connect: {
                        id: id,
                    },
                },
                date: GetCurrentDateTime(),
            },
        });

        res.json(setResponseJson({ points: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

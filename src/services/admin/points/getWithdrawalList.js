import prisma from "../../../prisma";
import {
    GetPlusDateTime,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

const getWithdrawalList = async (req, res) => {
    const { startDate, endDate, name, userId, phone, type } = req.query;
    console.log(req.query);
    try {
        const list = await prisma.pointBreakdown.findMany({
            where: {
                NOT: { userId: null },
                ...(startDate &&
                    endDate && {
                        AND: [
                            { date: { gt: GetPlusDateTime(startDate) } },
                            { date: { lt: GetPlusDateTime(endDate) } },
                        ],
                    }),
                ...(name && { user: { name } }),
                ...(userId && { user: { id: Number(userId) } }),
                ...(phone && { user: { phone } }),
                ...(type && { type }),
            },
            include: {
                user: {
                    include: {
                        userType: true,
                        workCategory: true,
                        point: true,
                    },
                },
            },
            orderBy: { id: "desc" },
        });

        res.json(setResponseJson({ list: list }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getWithdrawalList;

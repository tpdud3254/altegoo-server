import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const getGugupackSubscribeList = async (req, res) => {
    const { name, phone } = req.query;

    try {
        const result = await prisma.subscribeGugupack.findMany({
            where: {
                AND: [
                    { status: false },
                    {
                        ...(name && { user: { name } }),
                    },
                    { ...(phone && { user: { phone } }) },
                ],
            },
            include: {
                user: {
                    include: { point: true, workCategory: true },
                },
            },
            orderBy: { id: "desc" },
        });

        if (!result) throw new Error("구구팩 신청 목록을 불러올 수 없습니다.");

        res.json(setResponseJson({ list: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getCommissionList = async (req, res) => {
    const { name } = req.query;

    try {
        const list = await prisma.commission.findMany({
            where: {
                ...(name && { name }),
            },
            orderBy: { id: "asc" },
        });

        if (!list) throw new Error("수수료 조회이 실패하였습니다.");

        res.json(setResponseJson({ list }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

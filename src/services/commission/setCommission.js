import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const setCommission = async (req, res) => {
    const { name, decimal } = req.body;

    try {
        const result = await prisma.commission.update({
            where: {
                name,
            },
            data: {
                commission: decimal,
            },
        });

        if (!result) throw new Error("수수료 수정에 실패하였습니다.");

        res.json(setResponseJson({ commission: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

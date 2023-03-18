import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const createAccount = async (req, res) => {
    const { pointId, bank, accountName, accountNumber } = req.body;

    if (!pointId) throw new Error("계좌 정보 저장에 실패하였습니다.");

    try {
        const result = await prisma.point.update({
            where: { id: pointId },
            data: {
                bank,
                accountName,
                accountNumber,
            },
        });

        console.log(result);

        if (!result) throw new Error("계좌 정보 저장에 실패하였습니다.");

        res.json(setResponseJson({ account: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

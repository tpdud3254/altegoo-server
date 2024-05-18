import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const confirmGugupack = async (req, res) => {
    const { userIdList, selectedIdList } = req.body;

    try {
        const users = await prisma.user.updateMany({
            where: {
                OR: [...userIdList],
            },
            data: {
                gugupack: true,
            },
        });

        const list = await prisma.subscribeGugupack.updateMany({
            where: { OR: [...selectedIdList] },
            data: { status: true },
        });

        if (!users || !list) throw new Error("구구팩 가입에 실패하였습니다.");

        res.json(setResponseJson());
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

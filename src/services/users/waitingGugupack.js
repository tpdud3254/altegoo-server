import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const waitingGugupack = async (req, res) => {
    const id = req.id;

    if (!id) throw new Error("정보를 불러올 수 없습니다.");

    try {
        const exist = await prisma.subscribeGugupack.count({
            where: {
                AND: [{ userId: id }, { status: false }],
            },
        });

        if (exist > 0) {
            res.json(setResponseJson({ isExist: true }));
        } else {
            res.json(setResponseJson({ isExist: false }));
        }
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const subscribeGugupack = async (req, res) => {
    const id = req.id;

    if (!id) throw new Error("정보를 불러올 수 없습니다.");

    try {
        const result = await prisma.subscribeGugupack.create({
            data: {
                user: { connect: { id } },
            },
        });

        if (!result) throw new Error("구구팩 신청에 실패하였습니다.");

        res.json(setResponseJson());
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

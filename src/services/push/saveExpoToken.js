import prisma from "../../prisma";
import { setErrorJson } from "../../utils";

export const saveExpoToken = async (req, res) => {
    const { token } = req.body;
    const id = req.id;

    console.log(token);

    if (!token || !id) throw new Error("토큰 저장에 실패하였습니다.");

    try {
        const saveToken = await prisma.user.update({
            where: {
                id,
            },
            data: {
                pushToken: token,
            },
        });

        if (!saveToken) throw new Error("토큰 저장에 실패하였습니다.");

        res.json(setResponseJson({ data: saveToken }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const addLicense = async (req, res) => {
    const { url } = req.body;

    const id = req.id;

    console.log(url);
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                license: url,
            },
        });

        if (!user) throw new Error("사업자등록증 등록에 실패하였습니다.");

        const restInfo = await getUserRestInfo(user);

        res.json(
            setResponseJson({
                user: {
                    ...user,
                    ...restInfo,
                },
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

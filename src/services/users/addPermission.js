import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const addPermission = async (req, res) => {
    const { url } = req.body;

    const id = req.id;

    console.log(url);
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                vehiclePermission: url,
            },
        });

        if (!user)
            throw new Error(
                "화물자동차 운송사업 허가증 등록에 실패하였습니다."
            );

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

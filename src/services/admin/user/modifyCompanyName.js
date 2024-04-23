import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

export const modifyCompanyName = async (req, res) => {
    const { id, companyName } = req.body;

    console.log(companyName);
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                companyName,
            },
        });

        if (!user) throw new Error("기업명 수정에 실패하였습니다.");

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

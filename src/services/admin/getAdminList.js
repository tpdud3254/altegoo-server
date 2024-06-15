import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getAdminList = async (req, res) => {
    try {
        const list = await prisma.admin.findMany({
            where: { NOT: { id: 1 } },
            include: { position: true, telecom: true },
        });

        if (!list) throw new Error("관리자 조회에 실패하였습니다.");

        res.json(setResponseJson({ list }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

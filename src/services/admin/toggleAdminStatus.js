import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const toggleAdminStatus = async (req, res) => {
    const { status: value, adminId } = req.body;

    try {
        const result = await prisma.admin.update({
            where: { id: adminId },
            data: { status: value },
            include: { position: true, telecom: true },
        });

        if (!result) throw new Error("관리자 권한 설정에 실패하였습니다.");

        res.json(setResponseJson({ admin: result }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

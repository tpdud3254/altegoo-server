import bcrypt from "bcrypt";

import { setErrorJson, setResponseJson } from "../../utils";
import prisma from "../../prisma";

export const updateAccount = async (req, res) => {
    const {
        userId,
        password,
        name,
        idNumber,
        bank,
        bankAccountName,
        bankAccountNumber,
        telecomId,
        positionId,
        permission,
    } = req.body;

    console.log(req.body);

    let hashedPassword = null;

    if (password) hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.admin.update({
            where: {
                userId,
            },
            data: {
                ...(hashedPassword && { password: hashedPassword }),
                ...(name && { name }),
                ...(idNumber && { idNumber }),
                ...(bank && { bank }),
                ...(bankAccountName && { bankAccountName }),
                ...(bankAccountNumber && { bankAccountNumber }),
                ...(telecomId && { telecomId }),
                ...(positionId && { positionId }),
                ...(permission && { permission }),
            },
        });

        if (!user) throw new Error("회원 수정에 실패하였습니다.");

        res.json(setResponseJson({ user }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

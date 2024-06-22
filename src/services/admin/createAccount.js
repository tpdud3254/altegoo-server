import bcrypt from "bcrypt";

import { setErrorJson, setResponseJson } from "../../utils";
import prisma from "../../prisma";

export const createAccount = async (req, res) => {
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
    } = req.body;

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const permission = {
        menuPermissions: ["user"],
        submenuPermissions: ["user_search"],
        functionPermissions: [],
    };

    try {
        const user = await prisma.admin.create({
            data: {
                userId,
                password: hashedPassword,
                name,
                idNumber,
                bank,
                bankAccountName,
                bankAccountNumber,
                telecomId,
                positionId,
                permission: JSON.stringify(permission),
            },
        });

        if (!user) throw new Error("회원가입에 실패하였습니다.");

        res.json(setResponseJson({}));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

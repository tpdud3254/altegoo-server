import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { existUser } from "../../utils";

export const setPassword = async (req, res) => {
    const { phone, password } = req.body;

    console.log(req.body);

    const user = await existUser(phone);

    if (!user) {
        res.status(400).json({
            result: "INVALID: USER NOT FOUND",
            msg: "사용자를 찾을 수 없습니다.",
        });

        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
            where: { phone },
            data: {
                password: hashedPassword,
            },
        });

        if (user) {
            res.status(200).json({
                result: "VALID",
            });
        } else {
            res.status(400).json({
                result: "INVALID: FAIL CHANGE PASSWORD",
                msg: "비밀번호 변경에 실패하였습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({
            result: "INVALID: ERROR",
            error,
            msg: "비밀번호 변경에 실패하였습니다.",
        });
    }
};

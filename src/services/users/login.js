import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";
import { existUser, getUserRestInfo } from "../../utils";

export const login = async (req, res) => {
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

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        res.status(400).json({
            result: "INVALID: INCORRECT PASSWORD",
            msg: "비밀번호가 일치하지 않습니다.",
        });

        return;
    }

    try {
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        delete user.password;

        const userData = { ...(await getUserRestInfo(user)), ...user };

        if (token) {
            res.status(200).json({
                result: "VALID",
                data: { user: userData, token },
            });
        } else {
            res.status(400).json({
                result: "INVALID: LOGIN FAIL",
                msg: "로그인에 실패하였습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({ result: "INVALID: ERROR", error });
    }
};

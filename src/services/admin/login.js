import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setErrorJson, setResponseJson } from "../../utils";
import prisma from "../../prisma";

export const login = async (req, res) => {
    const { id, password } = req.body;

    console.log(req.body);

    try {
        const user = await prisma.admin.findUnique({
            where: {
                userId: id,
            },
        });

        if (!user) throw new Error("사용자를 찾을 수 없습니다.");

        if (user.status === false) {
            res.json(setResponseJson({ status: false }));
            return;
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) throw new Error("비밀번호가 일치하지 않습니다.");

        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        delete user.password;

        const userData = {
            ...user,
        };

        if (!token) throw new Error("로그인에 실패하였습니다.");

        res.json(setResponseJson({ user: userData, token, status: true }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

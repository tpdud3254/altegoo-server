import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const changePassword = async (req, res) => {
    const { curPassword, password } = req.body;

    try {
        const id = req.id;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        const checkPassword = await bcrypt.compare(curPassword, user.password);

        if (!checkPassword) throw new Error("비밀번호가 일치하지 않습니다.");

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword,
            },
        });

        if (!updatedUser) throw new Error("비밀번호 변경에 실패하였습니다.");

        res.json(setResponseJson(null));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import jwt from "jsonwebtoken";
import { setErrorJson, setResponseJson } from "../../utils";

export const verifyToken = async (req, res) => {
    const { token } = req.body;

    console.log(token);

    if (!token) throw new Error("사용자를 찾을 수 없습니다.");

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        if (!id) throw new Error("사용자를 찾을 수 없습니다.");

        const admin = await prisma.admin.findUnique({
            where: { id },
        });

        if (!admin) throw new Error("사용자를 찾을 수 없습니다.");

        delete admin.password;

        res.json(setResponseJson({ admin }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

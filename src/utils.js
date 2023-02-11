import prisma from "./prisma";
import jwt from "jsonwebtoken";

export const existUser = (phone) =>
    prisma.user.findUnique({
        where: { phone },
    });

export const craeteUserId = (code, id) => {
    return code + String(id).padStart(5, "0");
};

export const auth = async (req, res, next) => {
    const token = req.headers.auth;

    console.log(token);

    if (!token) {
        res.status(400).json({
            result: "INVALID: TOKEN NOT FOUND",
            msg: "사용자를 찾을 수 없습니다.",
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        if (!id) {
            res.status(400).json({
                result: "INVALID: TOKEN NOT FOUND",
                msg: "사용자를 찾을 수 없습니다.",
            });
        }
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (user) {
            req.id = user.id;
            next();
        } else {
            res.status(400).json({
                result: "INVALID: USER NOT FOUND",
                msg: "사용자를 찾을 수 없습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({
            result: "INVALID: FAIL",
            error,
            msg: "사용자를 찾을 수 없습니다.",
        });
    }
};

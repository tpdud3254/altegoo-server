import prisma from "../../prisma";

export const getUser = async (req, res) => {
    const { id, phone } = req.query;

    console.log(req.query);

    try {
        const user = await prisma.user.findUnique({
            where: id ? { id: parseInt(id) } : { phone: phone },
        });

        delete user.password;

        if (user) {
            res.status(200).json({ result: "VALID", data: user });
        } else {
            res.status(400).json({
                result: "INVALID: USER NOT FOUND",
                msg: "사용자를 찾을 수 없습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({
            result: "INVALID: ERROR",
            error,
            msg: "사용자를 찾을 수 없습니다.",
        });
    }
};

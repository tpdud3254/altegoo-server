import { setErrorJson, setResponseJson } from "../../utils";
import prisma from "../../prisma";

export const deleteAdmin = async (req, res) => {
    const { adminList } = req.body;

    console.log(adminList);
    try {
        let result = [];
        async function deleteAll() {
            const deleteResult = await Promise.all(
                adminList.map(async (value, index) => {
                    const admin = await prisma.admin.delete({
                        where: { id: Number(value) },
                    });

                    result.push(admin);
                })
            );
        }

        await deleteAll();

        console.log(result);
        if (!result) throw new Error("유저 삭제에 실패하였습니다.");

        res.json(setResponseJson({ admin: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

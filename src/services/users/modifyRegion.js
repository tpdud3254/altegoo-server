import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const modifyRegion = async (req, res) => {
    const { region } = req.body;

    const id = req.id;

    console.log(region);
    try {
        const regionArr = [];
        const disconnectArr = [];

        for (let index = 0; index < 18; index++) {
            disconnectArr.push({ id: index + 1 });
        }

        async function setRegion() {
            const regionResult = await Promise.all(
                region.map((region) => {
                    const newObj = { id: region };

                    const item = disconnectArr.find(
                        (item) => item.id === region
                    );
                    const findIndex = disconnectArr.indexOf(item);
                    if (findIndex > -1) disconnectArr.splice(findIndex, 1);
                    regionArr.push(newObj);
                })
            );
        }

        await setRegion();

        console.log("regionArr : ", regionArr);
        console.log("disconnectArr : ", disconnectArr);

        const user = await prisma.user.update({
            where: { id },
            data: {
                workRegion: {
                    connect: regionArr,
                    ...(disconnectArr.length > 0 && {
                        disconnect: disconnectArr,
                    }),
                },
            },
        });

        if (!user) throw new Error("작업 지역 수정에 실패하였습니다.");

        const restInfo = await getUserRestInfo(user);

        res.json(
            setResponseJson({
                user: {
                    ...user,
                    ...restInfo,
                },
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

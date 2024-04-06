import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const getOrderPrice = async (req, res) => {
    const { type } = req.query;

    console.log(type);
    try {
        let result = null;

        if (type === "ladderQuantity") {
        } else if (type === "ladderTime") {
        } else if (type === "sky") {
        } else if (type === "all") {
            result = {};

            const ladderQuantityPrice =
                await prisma.ladderQuantityPrice.findMany({
                    orderBy: { id: "asc" },
                });

            const ladderQuantityOption =
                await prisma.ladderQuantityOption.findMany({
                    orderBy: { id: "asc" },
                });

            result.ladderQuantity = {
                options: ladderQuantityOption,
                datas: ladderQuantityPrice,
            };

            const ladderTimePrice = await prisma.ladderTimePrice.findMany({
                orderBy: { id: "asc" },
            });

            const ladderTimeOption = await prisma.ladderTimeOption.findMany({
                orderBy: { id: "asc" },
            });

            result.ladderTime = {
                options: ladderTimeOption,
                datas: ladderTimePrice,
            };

            const skyTimePrice = await prisma.skyTimePrice.findMany({
                orderBy: { id: "asc" },
            });

            const skyTimeOption = await prisma.skyTimeOption.findMany({
                orderBy: { id: "asc" },
            });

            const skyTimeWeight = await prisma.skyTimeWeight.findMany({
                orderBy: { id: "asc" },
            });

            result.skyTime = {
                options: skyTimeOption,
                weight: skyTimeWeight,
                datas: skyTimePrice,
            };
        }

        if (!result) throw new Error("금액 수정에 실패하였습니다.");

        res.json(
            setResponseJson({
                priceTable: result,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

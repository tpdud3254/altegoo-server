import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setOrderPrice = async (req, res) => {
    const { type, data } = req.body;

    try {
        if (type === "ladderQuantity") {
            async function setPrice() {
                const priceResult = await Promise.all(
                    data.map(async (value) => {
                        const result = await prisma.ladderQuantityPrice.update({
                            where: {
                                identifier: {
                                    optionId: value.optoin,
                                    floor: value.floor,
                                },
                            },
                            data: {
                                price: value.price,
                            },
                        });

                        if (!result) {
                            throw new Error("금액 수정에 실패하였습니다.");
                        }
                    })
                );
            }
            if (data && data.length > 0) await setPrice();
        } else if (type === "ladderTime") {
            async function setPrice() {
                const priceResult = await Promise.all(
                    data.map(async (value) => {
                        const result = await prisma.ladderTimePrice.update({
                            where: {
                                identifier: {
                                    optionId: value.optoin,
                                    floor: value.floor,
                                },
                            },
                            data: {
                                price: value.price,
                            },
                        });

                        if (!result) {
                            throw new Error("금액 수정에 실패하였습니다.");
                        }
                    })
                );
            }
            if (data && data.length > 0) await setPrice();
        } else if (type === "skyTime") {
            async function setPrice() {
                const priceResult = await Promise.all(
                    data.map(async (value) => {
                        const result = await prisma.skyTimePrice.update({
                            where: {
                                identifier: {
                                    optionId: value.optoin,
                                    weightId: value.weight,
                                },
                            },
                            data: {
                                price: value.price,
                            },
                        });

                        if (!result) {
                            throw new Error("금액 수정에 실패하였습니다.");
                        }
                    })
                );
            }
            if (data && data.length > 0) await setPrice();
        }

        res.json(setResponseJson({}));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const addVehicle = async (req, res) => {
    const { vehicle } = req.body;

    const id = req.id;

    console.log(vehicle);
    try {
        const vehicleArr = [];

        async function setVehicle() {
            const vehicleResult = await Promise.all(
                vehicle.map(async (vehicle) => {
                    const result = await prisma.vehicle.create({
                        data: {
                            number: vehicle.number,
                            type: {
                                connect: {
                                    id: vehicle.type,
                                },
                            },
                            ...(vehicle.weight && {
                                weight: {
                                    connect: {
                                        id: vehicle.weight,
                                    },
                                },
                            }),
                            ...(vehicle.floor && {
                                floor: {
                                    connect: {
                                        id: vehicle.floor,
                                    },
                                },
                            }),
                        },
                    });

                    if (result) {
                        const newObj = { id: result.id };

                        vehicleArr.push(newObj);
                    }
                })
            );
        }

        if (vehicle && vehicle.length > 0) await setVehicle();

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(vehicleArr.length > 0 && {
                    vehicle: {
                        connect: vehicleArr,
                    },
                }),
            },
        });

        if (!user) throw new Error("차량 등록에 실패하였습니다.");

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

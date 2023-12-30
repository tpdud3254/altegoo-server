import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const modifyVehicle = async (req, res) => {
    const { vehicleId, vehicle, userId } = req.body;

    try {
        console.log(vehicleId);

        let vehicleResult = null;
        if (!vehicleId) {
            vehicleResult = await prisma.vehicle.create({
                data: {
                    number: vehicle.number,
                    User: { connect: { id: userId } },
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
                include: {
                    type: true,
                    floor: true,
                    weight: true,
                },
            });
        } else {
            vehicleResult = await prisma.vehicle.update({
                where: {
                    id: vehicleId,
                },
                data: {
                    number: vehicle.number,
                    type: {
                        connect: {
                            id: vehicle.type,
                        },
                    },
                    ...(vehicle.weight !== null
                        ? {
                              weight: {
                                  connect: {
                                      id: vehicle.weight,
                                  },
                              },
                          }
                        : {
                              weight: {
                                  disconnect: true,
                              },
                          }),
                    ...(vehicle.floor !== null
                        ? {
                              floor: {
                                  connect: {
                                      id: vehicle.floor,
                                  },
                              },
                          }
                        : {
                              floor: {
                                  disconnect: true,
                              },
                          }),
                },
                include: {
                    type: true,
                    floor: true,
                    weight: true,
                },
            });
        }
        console.log(vehicleResult);

        if (!vehicleResult) throw new Error("차량 등록에 실패하였습니다.");
        res.json(
            setResponseJson({
                vehicle: {
                    vehicleResult,
                },
            })
        );
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};

import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const addReservation = async (req, res) => {
  const { id: orderId } = req.body;

  const id = req.id;

  try {
    const reservation = await prisma.orderReservation.create({
      data: {
        user: {
          connect: { id },
        },
        order: {
          connect: {
            id: orderId,
          },
        },
      },
    });

    if (!reservation) throw new Error("예약대기에 실패했습니다.");

    const workList = await prisma.order.findMany({
      include: {
        registUser: { select: { id: true } },
        orderReservation: true,
      },
      orderBy: {
        id: "desc",
      },
      // take: 5,
      // skip: lastUserId ? 1 : 0,
      // ...(lastUserId && { cursor: { id: lastUserId } }),
      //TODO: pagination
    });

    if (!workList) throw new Error("예약대기에 실패했습니다.");

    res.json(setResponseJson({ list: workList }));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

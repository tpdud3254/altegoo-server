import prisma from "../../prisma";
import { setErrorJson } from "../../utils";

export const removeOrder = async (req, res) => {
  const { orderId } = req.body;
  const id = req.id;

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        orderStatusId,
      },
    });

    if (order.registUser !== id) throw new Error("사용자와 등록자 불일치");

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: {
          connect: {
            id: 7,
          },
        },
      },
      include: {
        registUser: { select: { id: true } },
        orderReservation: true,
      },
    });

    if (!updatedOrder) throw new Error("작업상태 변경에 실패했습니다.");

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

    if (!workList) throw new Error("작업상태 변경에 실패했습니다.");

    //TODO: 리스트 반환,.,?
    res.json(setResponseJson({ list: workList }));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

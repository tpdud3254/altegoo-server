import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const doneWork = async (req, res) => {
  const { id: orderId } = req.body;
  const id = req.id;

  if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        orderStatusId,
      },
    });

    if (order.acceptUser !== id) throw new Error("사용자와 작업자 불일치");

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: {
          connect: {
            id: 5,
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

import prisma from "../../prisma";
import { checkRegistUser, setErrorJson, setResponseJson } from "../../utils";

export const terminateWork = async (req, res) => {
  const { id: orderId } = req.body;
  const id = req.id;

  if (!orderId || !id) throw new Error("작업 상태를 변경할 수 없습니다.");

  try {
    if (await checkRegistUser(orderId, id)) {
      const work = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: {
            connect: {
              id: 6,
            },
          },
        },
        include: {
          registUser: { select: { id: true } },
          orderReservation: true,
        },
      });

      const registUserPoint = await prisma.point.findFirst({
        where: { userId: work.registUser.id },
        select: { curPoint: true },
      });

      const registUser = await prisma.point.update({
        where: { userId: work.registUser.id },
        data: {
          curPoint: registUserPoint.curPoint + work.point,
        },
      });

      const acceptUserPoint = await prisma.point.findFirst({
        where: { userId: work.acceptUser },
        select: { curPoint: true },
      });

      const acceptUser = await prisma.point.update({
        where: { userId: work.acceptUser },
        data: {
          curPoint: acceptUserPoint.curPoint + work.price,
        },
      });

      if (!registUser || !acceptUser) {
        throw new Error("포인트 변경에 실패했습니다. 관리자에게 문의해주세요.");
      }

      //TODO: 오류나면 원복,,
      res.json(setResponseJson({ list: workList }));
    }
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

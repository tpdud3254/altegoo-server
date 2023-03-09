import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getOrderInProgressCounts = async (req, res) => {
  try {
    const order = await prisma.order.count({
      where: {
        status: {
          id: 1,
        },
      },
    });
    if (order || order === 0) {
      res.json(setResponseJson({ count: order }));
    } else {
      throw new Error("작업 정보를 불러올 수 없습니다.");
    }
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

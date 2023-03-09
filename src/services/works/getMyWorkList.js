import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getMyWorkList = async (req, res) => {
  const id = req.id;

  try {
    const orders = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        order: true,
      },
    });

    if (orders) throw new Error("내 작업 불러오기에 실패하였습니다.");

    res.json(setResponseJson({ list: orders.order }));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

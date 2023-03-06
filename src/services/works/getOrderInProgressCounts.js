import prisma from "../../prisma";

export const getOrderInProgressCounts = async (req, res) => {
  const order = await prisma.order.count({
    where: {
      status: {
        id: 1,
      },
    },
  });

  if (order) {
    res.status(200).json({ result: "VALID", data: { count: order } });
  } else {
    res.status(400).json({
      result: "INVALID",
      msg: "작업 정보를 불러올 수 없습니다.",
    });
  }
};

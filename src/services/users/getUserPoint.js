import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getUserPoint = async (req, res) => {
  let id = req.id;

  console.log(id);

  if (!id) throw new Error("포인트 정보를 불러올 수 없습니다.");

  try {
    const point = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        point: true,
      },
    });

    console.log(point);

    if (!point) throw new Error("포인트 정보를 불러올 수 없습니다.");

    res.json(setResponseJson({ point: point.point }));
  } catch (error) {
    console.log(error.message);
    res.json(setErrorJson(error.message));
  }
};

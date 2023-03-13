import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const updateRecommendUser = async (req, res) => {
  const { id, userId } = req.body;

  console.log(id, userId);
  try {
    const recommendUser = await prisma.user.findFirst({
      where: {
        userId,
      },
    });

    console.log(recommendUser);

    if (!recommendUser) throw new Error("유효하지 않은 추천인 입니다.");
    if (recommendUser.id === id)
      throw new Error("해당 유저와 추천인이 같습니다. 다시 입력해주세요.");

    const result = await prisma.user.update({
      where: { id },
      data: { recommendUserId: recommendUser.id },
    });

    console.log(result);

    if (!result) throw new Error("추천인 변경에 실패하였습니다.");

    res.json(setResponseJson({ user: result }));
  } catch (error) {
    console.log(error.message);
    res.json(setErrorJson(error.message));
  }
};

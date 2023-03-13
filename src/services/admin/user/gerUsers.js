import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        userType: true,
        vehicle: true,
        workRegion: true,
        grade: true,
        point: true,
        pointBreakdown: true,
        order: true,
      },
      orderBy: { id: "asc" },
    });

    if (!users) throw new Error("유저 리스트를 불러올 수 없습니다.");

    async function getRecommendUser() {
      const usersList = await Promise.all(
        users.map(async (user, index) => {
          if (user.recommendUserId) {
            const recommendUser = await prisma.user.findUnique({
              where: { id: user.recommendUserId },
              select: { userName: true, userId: true },
            });

            console.log(recommendUser);
            users[index] = {
              recommendUser: recommendUser,
              ...users[index],
            };
          } else {
            users[index] = {
              recommendUser: null,
              ...users[index],
            };
          }
        })
      );
    }

    await getRecommendUser();

    console.log(users);

    res.json(setResponseJson({ users: users }));
  } catch (error) {
    console.log(error.message);
    res.json(setErrorJson(error.message));
  }
};

export default getUsers;

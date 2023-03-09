import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const editProfile = async (req, res) => {
  const {
    userType,
    name,
    license,
    vehicleNumber,
    vehicleWeight,
    vehicleType,
    workRegion,
    sms,
    avatar,
    greeting,
  } = req.body;

  const id = req.id;

  console.log(id);
  console.log(req.body);

  try {
    const regionArr = [];

    if (workRegion) {
      workRegion.map((region) => {
        const newObj = { id: region };

        regionArr.push(newObj);
      });
    }

    const prevRegion = await prisma.user.findMany({
      where: { id },
      select: {
        workRegion: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!prevRegion) throw new Error("작업 지역 변경에 실패하였습니다.");

    //TODO: 라이센스 이미지 저장
    //TODO: 아바타 이미지 저장

    const user = await prisma.user.update({
      where: { id },
      data: {
        userType: {
          connect: { id: userType },
        },
        name,
        sms,
        greeting,
        ...(license && {
          license,
        }),
        ...(vehicleNumber && {
          vehicleNumber,
        }),
        ...(vehicleWeight && {
          vehicleWeight: {
            connect: {
              id: vehicleWeight,
            },
          },
        }),
        ...(vehicleType && {
          vehicleType: {
            connect: {
              id: vehicleType,
            },
          },
        }),
        ...(regionArr.length > 0 && {
          workRegion: {
            disconnect: prevRegion[0].workRegion,
            connect: regionArr,
          },
        }),
        ...(avatar && {
          avatar,
        }),
      },
    });

    if (!user) throw new Error("프로필 변경에 실패하였습니다.");

    delete user.password;

    const restInfo = await getUserRestInfo(user);
    delete restInfo.workRegion;

    res.json(
      setResponseJson({
        user: {
          ...user,
          ...restInfo,
          ...{ workRegion: workRegion },
        },
      })
    );
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

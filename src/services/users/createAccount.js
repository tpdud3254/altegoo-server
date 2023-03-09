import bcrypt from "bcrypt";
import prisma from "../../prisma";
import {
  craeteUserId,
  getUserRestInfo,
  setErrorJson,
  setResponseJson,
} from "../../utils";

export const createAccount = async (req, res) => {
  const {
    userCode,
    userType,
    userName,
    name,
    password,
    phone,
    birth,
    license,
    vehiclePermission,
    vehicle,
    recommendUserId,
    gender,
    status,
    workRegion,
    accessedRegion,
    sms,
    grade,
  } = req.body;

  console.log(req.body);

  const hashedPassword = await bcrypt.hash(password, 10);

  //TODO: 아바타 이미지 저장

  let user;

  try {
    if (userCode === "P") {
      //일반회원
      user = await prisma.user.create({
        data: {
          userType: {
            connect: { id: userType },
          },
          userName,
          name,
          password: hashedPassword,
          phone,
          birth,
          gender,
          status,
          accessedRegion,
          sms,
          grade: {
            connect: {
              id: grade,
            },
          },
          point: {
            create: {
              curPoint: 0,
            },
          },
        },
      });
    } else if (userCode === "S") {
      const regionArr = [];

      workRegion.map((region) => {
        const newObj = { id: region };

        regionArr.push(newObj);
      });

      const vehicleArr = [];

      async function setVehicle() {
        const vehicleResult = await Promise.all(
          vehicle.map(async (vehicle) => {
            const result = await prisma.vehicle.create({
              data: {
                number: vehicle.number,
                type: {
                  connect: {
                    id: vehicle.type,
                  },
                },
                weight: {
                  connect: {
                    id: vehicle.weight,
                  },
                },
              },
            });

            if (result) {
              const newObj = { id: result.id };

              vehicleArr.push(newObj);
            }
          })
        );
      }

      await setVehicle();

      //기사회원
      user = await prisma.user.create({
        data: {
          userType: {
            connect: { id: userType },
          },
          userName,
          name,
          password: hashedPassword,
          phone,
          birth,
          license,
          vehiclePermission,
          vehicle: {
            connect: vehicleArr,
          },
          recommendUserId,
          gender,
          status,
          workRegion: {
            connect: regionArr,
          },
          accessedRegion,
          sms,
          grade: {
            connect: {
              id: grade,
            },
          },
          point: {
            create: {
              curPoint: 0,
            },
          },
        },
      });
    } else {
      //기업회원
      const regionArr = [];

      workRegion.map((region) => {
        const newObj = { id: region };

        regionArr.push(newObj);
      });

      const vehicleArr = [];

      async function setVehicle() {
        const vehicleResult = await Promise.all(
          vehicle.map(async (vehicle) => {
            const result = await prisma.vehicle.create({
              data: {
                number: vehicle.number,
                type: {
                  connect: {
                    id: vehicle.type,
                  },
                },
                weight: {
                  connect: {
                    id: vehicle.weight,
                  },
                },
              },
            });

            if (result) {
              const newObj = { id: result.id };

              vehicleArr.push(newObj);
            }
          })
        );
      }

      await setVehicle();

      user = await prisma.user.create({
        data: {
          userType: {
            connect: { id: userType },
          },
          userName,
          name,
          password: hashedPassword,
          phone,
          birth,
          license,
          vehiclePermission,
          vehicle: {
            connect: vehicleArr,
          },
          recommendUserId,
          gender,
          status,
          workRegion: {
            connect: regionArr,
          },
          accessedRegion,
          sms,
          grade: {
            connect: {
              id: grade,
            },
          },
          point: {
            create: {
              curPoint: 0,
            },
          },
        },
      });
    }

    if (!user) throw new Error("회원가입에 실패하였습니다.");

    const userId = craeteUserId(userCode, user.id);

    const account = await prisma.user.update({
      where: { id: user.id },
      data: {
        userId,
      },
    });

    if (!account) throw new Error("회원가입에 실패하였습니다.");
    delete account.password;

    const userData = {
      ...(await getUserRestInfo(account)),
      ...account,
    };

    res.json(setResponseJson({ user: userData }));
  } catch (error) {
    console.log(error);
    res.json(setErrorJson(error.message));
  }
};

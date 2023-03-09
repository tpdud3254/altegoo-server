import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { existUser, setErrorJson, setResponseJson } from "../../utils";

export const setPassword = async (req, res) => {
  const { phone, password } = req.body;

  console.log(req.body);

  const user = await existUser(phone);

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
      },
    });

    if (!user) throw new Error("비밀번호 변경에 실패하였습니다.");

    res.json(setResponseJson(null));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

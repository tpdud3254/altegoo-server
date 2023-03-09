import prisma from "../../prisma";
import jwt from "jsonwebtoken";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  console.log(token);

  if (!token) throw new Error("사용자를 찾을 수 없습니다.");

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (!id) throw new Error("사용자를 찾을 수 없습니다.");

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    delete user.password;
    const userData = { ...(await getUserRestInfo(user)), ...user };

    console.log(userData);

    res.json(setResponseJson({ user: userData }));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

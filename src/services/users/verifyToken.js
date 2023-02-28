import prisma from "../../prisma";
import jwt from "jsonwebtoken";
import { getUserRestInfo } from "../../utils";

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  console.log(token);

  if (!token) {
    res.status(400).json({
      result: "INVALID: TOKEN NOT FOUND",
      msg: "사용자를 찾을 수 없습니다.",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (!id) {
      res.status(400).json({
        result: "INVALID: TOKEN NOT FOUND",
        msg: "사용자를 찾을 수 없습니다.",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      delete user.password;
      const userData = { ...(await getUserRestInfo(user)), ...user };

      console.log(userData);
      res.status(200).json({
        result: "VALID",
        data: { user: userData },
      });
    } else {
      res.status(400).json({
        result: "INVALID: USER NOT FOUND",
        msg: "사용자를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "INVALID: FAIL",
      error,
      msg: "사용자를 찾을 수 없습니다.",
    });
  }
};

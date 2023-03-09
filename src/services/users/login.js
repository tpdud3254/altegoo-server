import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  existUser,
  getUserRestInfo,
  setErrorJson,
  setResponseJson,
} from "../../utils";

export const login = async (req, res) => {
  const { phone, password } = req.body;

  console.log(req.body);

  const user = await existUser(phone);

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) throw new Error("비밀번호가 일치하지 않습니다.");

  try {
    const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    delete user.password;

    const userData = { ...(await getUserRestInfo(user)), ...user };

    if (!token) throw new Error("로그인에 실패하였습니다.");

    res.json(setResponseJson({ user: userData, token }));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};

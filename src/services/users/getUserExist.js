import { existUser } from "../../utils";

export const getUserExist = async (req, res) => {
  const { phone } = req.query;

  console.log(phone);
  //TODO 예외처리 보강강
  const user = await existUser(phone);
  if (user) {
    res.status(200).json({ result: "VALID", data: { userId: user.id } });
  } else {
    res.status(400).json({
      result: "INVALID: USER NOT FOUND",
      msg: "사용자를 찾을 수 없습니다.",
    });
  }
};

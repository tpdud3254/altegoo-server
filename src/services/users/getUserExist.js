import { existUser } from "../../utils";

export const getUserExist = async (req, res) => {
  const { phone } = req.query;

  console.log(phone);
  //TODO 예외처리 보강강
  try {
    const user = await existUser(phone);
    res.json({ result: "VALID", data: { userId: user.id } });
  } catch (error) {
    console.log(error.message);
    res.json({ result: "INVALID", msg: error.message });
  }
};

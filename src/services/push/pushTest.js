import { sendPushToUser } from "../../utils";

export const pushTest = async (req, res) => {
  const response = await sendPushToUser(
    "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    "send?",
    "send!"
  );

  console.log(response);
};

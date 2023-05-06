import {
    sendPushToUsers,
    sendPushToUser,
    sendPushToAllUsers,
} from "../../utils";

export const pushTest = async (req, res) => {
    // const response = await sendPushToUser(
    //   "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //   "send?",
    //   "send!"
    // );

    // const response = await sendPushToUsers(
    //     [
    //         "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
    //         "ExponentPushToken[Z1uqJ_NbaqRzNtrec7IytG]",
    //     ],
    //     "send?",
    //     "send!"
    // );

    const response = await sendPushToAllUsers("send?", "send!");

    console.log(response);
};

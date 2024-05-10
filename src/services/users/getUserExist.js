import {
    existUser,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const getUserExist = async (req, res) => {
    const { phone } = req.query;

    console.log(phone);
    //TODO 예외처리 보강강
    try {
        const user = await existUser(phone);

        const restInfo = await getUserRestInfo(user);

        delete user.password;

        res.json(
            setResponseJson({
                userId: user.id,
                ...user,
                ...restInfo,
            })
        );
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

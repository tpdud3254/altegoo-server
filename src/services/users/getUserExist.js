import { existUser, setErrorJson, setResponseJson } from "../../utils";

export const getUserExist = async (req, res) => {
    const { phone } = req.query;

    console.log(phone);
    //TODO 예외처리 보강강
    try {
        const user = await existUser(phone);
        res.json(
            setResponseJson({
                userId: user.id,
                name: user.name,
                phone: user.phone,
                userTypeId: user.userTypeId,
            })
        );
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

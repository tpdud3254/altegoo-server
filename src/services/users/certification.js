import axios from "axios";
import { setErrorJson, setResponseJson } from "../../utils";

const NICE_SERVER = "https://svc.niceapi.co.kr:22001";
const client_id = "2d981f65-0f61-4a27-b076-5ed681f30763";
const client_secret = "c26a268437276d584bbc0361224ff79a";

export const certification = (req, res) => {
    const getToken = async () => {
        const params = new URLSearchParams();

        params.append("grant_type", "client_credentials");
        params.append("scope", "default");

        try {
            const response = await axios.post(
                NICE_SERVER + "/digital/niceid/oauth/oauth/token",
                // queryString.stringify({
                //     grant_type: "client_credentials",
                //     scope: "default",
                // }),
                params,
                {
                    headers: {
                        "Content-Type":
                            "aapplication/x-www-form-urlencoded;charset=utf-8",
                        Authorization:
                            "Basic " + btoa(`${client_id}:${client_secret}`),
                    },
                }
            );

            console.log("certi response : ", response);
            res.json(setResponseJson({ response: response }));
        } catch (error) {
            console.log(error.message);
            res.json(setErrorJson(error.message));
        }
    };
    getToken();
};

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
                params,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=utf-8",
                        Authorization:
                            "Basic " + btoa(`${client_id}:${client_secret}`),
                    },
                }
            );

            console.log("certi response : ", response.data);

            const timestamp = new Date().getTime() / 1000;
            const response2 = await axios.post(
                NICE_SERVER + "/digital/niceid/api/v1.0/common/crypto/token",
                {
                    req_dtim: new Date.now(),
                    req_no: "123148814",
                    enc_mode: "AES128",
                },
                {
                    headers: {
                        Authorization:
                            "bearer " +
                            btoa(
                                `${response.data.dataBody.access_token}:${timestamp}:${client_id}`
                            ),
                        client_id,
                        productID: 2101979031,
                    },
                }
            );

            console.log("certi response2 : ", response2);
            res.json(setResponseJson({ response: response.data }));
        } catch (error) {
            console.log(error);
            res.json(setErrorJson(error.message));
        }
    };
    getToken();
};

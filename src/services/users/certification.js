import axios from "axios";
import { setErrorJson, setResponseJson } from "../../utils";

const NICE_SERVER = "https://svc.niceapi.co.kr:22001";
const client_id = "2d981f65-0f61-4a27-b076-5ed681f30763";
const client_secret = "c26a268437276d584bbc0361224ff79a";
const access_token = "93086090-8f0d-4d18-b7aa-68ea7521c725";

export const certification = (req, res) => {
    const getToken = async () => {
        const numberWithZero = (num) => {
            return num < 10 ? "0" + num : num;
        };

        try {
            const curDate = new Date();
            const dtim = `${curDate.getFullYear()}${numberWithZero(
                curDate.getMonth() + 1
            )}${numberWithZero(curDate.getDate())}${numberWithZero(
                curDate.getHours()
            )}${numberWithZero(curDate.getMinutes())}${numberWithZero(
                curDate.getSeconds()
            )}`;
            const no = "qwerty123456098765poiuytxcv567";

            const response = await axios.post(
                NICE_SERVER + "/digital/niceid/api/v1.0/common/crypto/token",
                {
                    dataHeader: { CNTY_CD: "ko" },
                    dataBody: {
                        req_dtim: dtim,
                        req_no: no,
                        enc_mode: "1",
                    },
                },
                {
                    headers: {
                        Authorization:
                            "bearer " +
                            btoa(
                                `${response.data.dataBody.access_token}:${timestamp}:${client_id}`
                            ),
                        client_id,
                        productID: "2101979031",
                    },
                }
            );

            console.log("certi response: ", response.data);

            const token_val = response.data.dataBody.token_val;
            const str = `${dtim.trim()}${no.trim()}${token_val.trim()}`;

            let hashAlgorithm = crypto.createHash("sha256");
            let hashing = hashAlgorithm.update(str);
            let hashedString = hashing.digest("base64");

            console.log("hashedString : ", hashedString);

            res.json(setResponseJson({ response: response.data }));
        } catch (error) {
            console.log(error);
            res.json(setErrorJson(error.message));
        }
    };
    getToken();
};

//access_token 발급 (유효기간 50년)

// const params = new URLSearchParams();

//         params.append("grant_type", "client_credentials");
//         params.append("scope", "default");

// const response = await axios.post(
//     NICE_SERVER + "/digital/niceid/oauth/oauth/token",
//     params,
//     {
//         headers: {
//             "Content-Type":
//                 "application/x-www-form-urlencoded;charset=utf-8",
//             Authorization:
//                 "Basic " + btoa(`${client_id}:${client_secret}`),
//         },
//     }
// );

// console.log("certi response : ", response.data.dataBody);

// const timestamp = Date.now();
// const curDate = new Date();
// const dtim = `${curDate.getFullYear()}${numberWithZero(
//     curDate.getMonth() + 1
// )}${numberWithZero(curDate.getDate())}${numberWithZero(
//     curDate.getHours()
// )}${numberWithZero(curDate.getMinutes())}${numberWithZero(
//     curDate.getSeconds()
// )}`;

// console.log("timestamp: ", timestamp);

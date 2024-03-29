import axios from "axios";
import { setErrorJson, setResponseJson } from "../../utils";
const crypto = require("crypto");

const NICE_SERVER = "https://svc.niceapi.co.kr:22001";
const client_id = "2d981f65-0f61-4a27-b076-5ed681f30763";
const client_secret = "c26a268437276d584bbc0361224ff79a";
const access_token = "93086090-8f0d-4d18-b7aa-68ea7521c725";

export const certification = (req, res) => {
    const getToken = async () => {
        const numberWithZero = (num) => {
            return num < 10 ? "0" + num : num;
        };

        function hmac256(secretKey, message) {
            const hmac = crypto.createHmac("sha256", secretKey);
            hmac.update(message);
            return hmac.digest();
        }

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
            const timestamp = Date.now();

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
                            btoa(`${access_token}:${timestamp}:${client_id}`),
                        client_id,
                        productID: "2101979031",
                    },
                }
            );

            console.log("certi response: ", response.data);

            const token_val = response.data.dataBody.token_val;
            const site_code = response.data.dataBody.site_code;
            const token_version_id = response.data.dataBody.token_version_id;

            //대칭키 생성
            const str = `${dtim.trim()}${no.trim()}${token_val.trim()}`;
            const sha256Hash = crypto.createHash("sha256").update(str).digest();
            const hashedData = sha256Hash.toString("base64");
            console.log("hashedData : ", hashedData);

            const key = hashedData.substring(0, 16);
            const iv = hashedData.substring(
                hashedData.length - 16,
                hashedData.length
            );
            const hmac_key = hashedData.substring(0, 32);

            console.log("key : ", key, " / len : ", key.length);
            console.log("iv : ", iv, " / len : ", iv.length);
            console.log("hmac_key : ", hmac_key, " / len : ", hmac_key.length);

            //요청 데이터 암호화
            const reqData = JSON.stringify({
                requestno: no,
                returnurl:
                    "https://master.d1p7wg3e032x9j.amplifyapp.com/certification",
                sitecode: site_code,
                methodtype: "get",
                popupyn: "Y",
                receivedata: "datadata",
            });

            const cipher = crypto.createCipheriv(
                "aes-128-cbc",
                Buffer.from(key),
                iv
            );

            let encryptedData = cipher.update(reqData, "utf-8", "base64");
            encryptedData += cipher.final("base64");

            //무결성체크값 생성
            const hmac = crypto.createHmac("sha256", hmac_key);
            hmac.update(encryptedData);
            const integrityCheckValue = hmac.digest("base64");

            res.json(
                setResponseJson({
                    data: {
                        token_version_id,
                        enc_data: encryptedData,
                        integrity_value: integrityCheckValue,
                        key,
                        iv,
                    },
                })
            );
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

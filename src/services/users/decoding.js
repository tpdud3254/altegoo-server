import { setErrorJson, setResponseJson } from "../../utils";
const crypto = require("crypto");
const iconv = require("iconv-lite");

export const decoding = async (req, res) => {
    const { enc_data, key, iv } = req.body;

    try {
        console.log("enc_data : ", enc_data);
        console.log("key : ", key);
        console.log("iv : ", iv);

        const encryptedBuffer = Buffer.from(enc_data, "base64");

        const decipher = crypto.createDecipheriv(
            "aes-128-cbc",
            Buffer.from(key),
            Buffer.from(iv)
        );
        let decryptedData = decipher.update(encryptedBuffer, null, "utf-8");
        decryptedData += decipher.final("utf-8");

        console.log("복호화된 데이터:", decryptedData);

        // const eucKrBuffer = iconv.encode(decryptedData, "euc-kr");
        // const eucKrString = eucKrBuffer.toString();

        res.json(setResponseJson({ data: decryptedData }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

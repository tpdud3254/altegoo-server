import { uploadFile } from "../../utils";
import AWS from "aws-sdk";

const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = "altegoo-bucket";

const s3 = new AWS.S3({ accessKeyId: ID, secretAccessKey: SECRET });

export const saveVehiclePermission = async (req, res) => {
    const type = "vehicle-permission";
    const file = req.file;
    const key = `${type}/${Date.now()}_${file.originalname}`;

    const params = { Bucket: BUCKET_NAME, Key: key, Body: file.buffer };
    s3.upload(params, function (err, data) {
        if (err) {
            res.status(400).json({
                result: "INVALID",
            });
        }
        console.log(`File upload successfully. ${data.Location}`);

        res.status(200).json({
            result: "VALID",
            data: { location: data.Location },
        });
    });
};

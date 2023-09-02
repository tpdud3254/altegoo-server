import axios from "axios";
import { useEffect, useState } from "react";

const NICE_SERVER = "https://svc.niceapi.co.kr:22001";
const client_id = "2d981f65-0f61-4a27-b076-5ed681f30763";
const client_secret = "c26a268437276d584bbc0361224ff79a";

function Certification() {
    useEffect(() => {
        getToken();
    }, []);

    const getToken = async () => {
        try {
            const response = await axios.post(
                NICE_SERVER + "/digital/niceid/oauth/oauth/token",
                {
                    grant_type: "client_credentials",
                    scope: "default",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: (
                            "Basic " + `${client_id}:${client_secret}`
                        ).toString("base64"),
                    },
                }
            );

            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        document.addEventListener("message", async (event) => {
            const parsed = JSON.parse(event.data);

            // try {
            //     const response = await axios.get(
            //         "https://dapi.kakao.com/v2/local/search/address.json",
            //         {
            //             params: {
            //                 query: parsed.address,
            //             },
            //             headers: {
            //                 Authorization:
            //                     "KakaoAK 86e0df46fbae745bb4c658276b280088",
            //             },
            //         }
            //     );

            //     console.log(response);

            //     setLng(response.data.documents[0].x);
            //     setLat(response.data.documents[0].y);
            // } catch (error) {}
        });
    }, []);

    return <div></div>;
}

export default Certification;

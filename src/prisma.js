import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
    switch (params.model) {
        case "User":
            switch (params.action) {
                //생성
                case "create": {
                    //createdAt
                    const createdAt = new Date();
                    const newCreatedAt = createdAt.setHours(
                        createdAt.getHours() + 9
                    );
                    params.args.data.createdAt = new Date(newCreatedAt);

                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);

                    break;
                }
                //수정
                case "updateMany":
                case "update": {
                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);
                    break;
                }
            }
            break;
        case "PointBreakdown":
            break;
        case "Order":
            switch (params.action) {
                //생성
                case "create": {
                    //createdAt
                    const createdAt = new Date();
                    const newCreatedAt = createdAt.setHours(
                        createdAt.getHours() + 9
                    );
                    params.args.data.createdAt = new Date(newCreatedAt);

                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);

                    break;
                }
                //수정
                case "updateMany":
                case "update": {
                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);
                    break;
                }
            }
            break;
        case "Admin":
            //TODO: 나중에 테스트해보기
            switch (params.action) {
                //생성
                case "create": {
                    //createdAt
                    const createdAt = new Date();
                    const newCreatedAt = createdAt.setHours(
                        createdAt.getHours() + 9
                    );
                    params.args.data.createdAt = new Date(newCreatedAt);

                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);

                    break;
                }
                //수정
                case "updateMany":
                case "update": {
                    //updatedAt
                    const updatedAt = new Date();
                    const newUpdatedAt = updatedAt.setHours(
                        updatedAt.getHours() + 9
                    );
                    params.args.data.updatedAt = new Date(newUpdatedAt);
                    break;
                }
            }
            break;
    }

    return next(params);
});
export default prisma;

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTTPMethodEnum } from '../utils/commonEnums';

export const lambdaUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userRepository = new PrismaUserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);
        console.log(JSON.stringify(event));

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case HTTPMethodEnum.POST.toString():
                const resultPost = await userController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case HTTPMethodEnum.GET.toString():
                if (idParameter) {
                    const resultGet = await userController.getById(idParameter);
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                } else {
                    const resultGet = await userController.getAll();
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            data: resultGet,
                        }),
                    };
                }
            case HTTPMethodEnum.PUT.toString():
                const resultPut = await userController.update(idParameter, event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPut,
                    }),
                };
            case HTTPMethodEnum.DELETE.toString():
                await userController.delete(idParameter);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'OK',
                    }),
                };

            default:
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        message: 'Something went wrong',
                    }),
                };
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};

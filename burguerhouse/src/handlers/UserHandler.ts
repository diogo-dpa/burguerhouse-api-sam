import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { ErrorHandler } from '../utils/ErrorHandler';

export const lambdaUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userRepository = new PrismaUserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);
        console.log(JSON.stringify(event));

        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case 'POST':
                const resultPost = await userController.create(event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPost,
                    }),
                };
            case 'GET':
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
            case 'PUT':
                const resultPut = await userController.update(idParameter, event.body ?? '');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: resultPut,
                    }),
                };
            case 'DELETE':
                await userController.delete(idParameter);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'OK',
                    }),
                };

            default:
                console.log('ERROR');
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'ERRO',
                    }),
                };
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};

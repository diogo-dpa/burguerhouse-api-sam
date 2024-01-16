import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from './src/controllers/UserController';
import { UserService } from './src/services/UserService';
import { PrismaUserRepository } from './src/repositories/prisma/PrismaUserRepository';

import * as schema from './prisma/schema.prisma';
import * as x from './node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node';
import * as l from './node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node';

if (process.env.NODE_ENV !== 'production') {
    console.debug(schema, x, l);
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userRepository = new PrismaUserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);
        console.log(JSON.stringify(event));

        const formattedBody = event.body ? JSON.parse(event.body) : '';
        const idParameter = event.pathParameters?.id ?? '';
        switch (event.httpMethod) {
            case 'POST':
                const resultPost = await userController.create(formattedBody);
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
                const resultPut = await userController.update(idParameter, formattedBody);
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
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

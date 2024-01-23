import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { PrismaUserRepository } from '../repositories/prisma/PrismaUserRepository';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTTPMethodEnum } from '../utils/commonEnums';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { formatQueryParameters } from './utilsHandler';

export const lambdaUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userRepository = new PrismaUserRepository();
        const userService = new UserService(userRepository);
        const userController = new UserController(userService);
        console.log(JSON.stringify(event));

        const idParameter = event.pathParameters?.id ?? '';
        const relationParameter = event.pathParameters?.relation ?? '';
        const headerString = JSON.stringify(event.headers);
        const parsedQueryParameter = JSON.stringify(event.queryStringParameters ?? '');
        const queryParameter = formatQueryParameters(JSON.parse(parsedQueryParameter));

        switch (event.httpMethod) {
            case HTTPMethodEnum.POST.toString():
                const resultPost = await userController.create({
                    header: headerString,
                    params: {
                        queryParameter,
                    },
                    body: event.body ?? '',
                });
                return resultPost as APIGatewayProxyResult;
            case HTTPMethodEnum.GET.toString():
                if (relationParameter) {
                    const resultGet = await userController.getRelationshipById({
                        header: headerString,
                        params: {
                            pathParameter: { id: idParameter },
                            queryParameter: {
                                ...queryParameter,
                                relation: relationParameter,
                            },
                        },
                    });
                    return resultGet as APIGatewayProxyResult;
                } else if (idParameter) {
                    const resultGet = await userController.getById({
                        header: headerString,
                        params: {
                            pathParameter: { id: idParameter },
                            queryParameter: {
                                ...queryParameter,
                                relation: relationParameter,
                            },
                        },
                    });
                    return resultGet as APIGatewayProxyResult;
                } else {
                    const resultGet = await userController.getAll({ header: headerString, params: { queryParameter } });
                    return resultGet as APIGatewayProxyResult;
                }
            case HTTPMethodEnum.PATCH.toString():
                const resultPut = await userController.update({
                    header: headerString,
                    params: { pathParameter: { id: idParameter }, queryParameter },
                    body: event.body ?? '',
                });
                return resultPut as APIGatewayProxyResult;
            case HTTPMethodEnum.DELETE.toString():
                const resultDelete = await userController.delete({
                    header: headerString,
                    params: { pathParameter: { id: idParameter } },
                });
                return resultDelete as APIGatewayProxyResult;
            default:
                const response = new JSONAPIHandler().mountErrorResponseNotFound();
                return response as APIGatewayProxyResult;
        }
    } catch (error) {
        console.log(error);
        return ErrorHandler.internalServerErrorHandler(error);
    }
};

import { StatusCodeEnum } from '../utils/commonEnums';
import { JSONAPIHandler } from '../utils/jsonapi/JsonapiHandler';
import { ControllerResponseJsonAPI } from '../utils/jsonapi/typesJsonapi';

export function defineErrorResponse(errorMessage: string): ControllerResponseJsonAPI {
    const [code, message] = errorMessage.split('-').map((message) => message.trim());

    const jsonAPIHandler = new JSONAPIHandler();

    switch (code) {
        case StatusCodeEnum.notFound.toString():
            return jsonAPIHandler.mountErrorResponseNotFound(message);
        case StatusCodeEnum.badRequest.toString():
            return jsonAPIHandler.mountErrorResponseBadRequest(message);
        default:
        case StatusCodeEnum.internalServerError.toString():
            return jsonAPIHandler.mountErrorResponseInternalServer(message);
    }
}

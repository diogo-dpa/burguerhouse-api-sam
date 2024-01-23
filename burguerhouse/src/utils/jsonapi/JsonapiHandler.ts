import { StatusCodeEnum } from '../commonEnums';
import {
    ControllerResponseJsonAPI,
    JsonAPIBodyDataType,
    JsonAPIBodyErrorResponse,
    JsonAPIBodyResponse,
    JsonAPIBodyResponseArray,
    MountSuccessResponseType,
} from './typesJsonapi';
import { mapRelationTypeToModelType } from './utilsJsonapi';

export class JSONAPIHandler {
    public static badRequestDescription = 'Bad Request';
    private contentType = 'application/vnd.api+json';

    private readonly availableDataPrimaryKeys: string[] = ['data', 'meta', 'links', 'included', 'errors', 'jsonapi'];
    private readonly availableQueryParams: string[] = ['include', 'fields', 'sort', 'page', 'filter'];

    private readonly commonJsonAPI = {
        version: '1.0',
        authors: ['Diogo Almazan'],
    };

    // Validation methods
    public validateContentType(headers: string): boolean {
        const parsedHeaders = JSON.parse(headers);

        const contentType = parsedHeaders['Content-Type'];
        if (!contentType || contentType !== this.contentType) return false;

        return true;
    }

    public validateAvailableDataPrimaryKeys(body: string): boolean {
        const parsedBody = JSON.parse(body);
        if (!Object.keys(parsedBody).every((key) => this.availableDataPrimaryKeys.includes(key))) return false;

        return true;
    }

    // Response methods
    public mountSuccessResponse<T>({
        options,
        body,
        relationships = null,
        statusCode = StatusCodeEnum.success,
    }: MountSuccessResponseType): ControllerResponseJsonAPI {
        if (Array.isArray(body)) return this.mountErrorResponseConflict();

        const dataBodyId = body?.id ?? '';

        const bodyWithoutId: Record<string, any> | null = body
            ? Object.fromEntries(
                  Object.entries(body).filter(
                      ([key]) =>
                          key !== 'id' &&
                          key !== 'type' &&
                          (!relationships?.type || key !== mapRelationTypeToModelType(relationships.type)),
                  ),
              )
            : null;

        const response: JsonAPIBodyResponse<T> = {
            data: bodyWithoutId
                ? {
                      type: options.type,
                      id: dataBodyId,
                      attributes: {
                          ...(bodyWithoutId as T),
                      },
                      relationships: relationships
                          ? {
                                [relationships.type]: {
                                    links: {
                                        self: `http://localhost:3000/${mapRelationTypeToModelType(
                                            options.type,
                                        )}/${dataBodyId}/relationships/${relationships.type}`,
                                        related: `http://localhost:3000/${mapRelationTypeToModelType(
                                            options.type,
                                        )}/${dataBodyId}/${relationships.type}`,
                                    },
                                    data:
                                        relationships.includeData && body
                                            ? body[mapRelationTypeToModelType(relationships.type)].map(
                                                  (relation: any) => ({
                                                      id: relation.id,
                                                      type: relationships.type,
                                                      attributes: {
                                                          ...Object.fromEntries(
                                                              Object.entries(relation).filter(([key]) => key !== 'id'),
                                                          ),
                                                      },
                                                  }),
                                              )
                                            : undefined,
                                },
                            }
                          : undefined,
                  }
                : null,
            links: {
                self: `http://localhost:3000/${options.linkSelf}`,
            },
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: statusCode,
            body: JSON.stringify(response),
        };
    }

    public mountSuccessResponseArray<T>({
        options,
        body,
        relationships = null,
        statusCode = StatusCodeEnum.success,
    }: MountSuccessResponseType): ControllerResponseJsonAPI {
        if (!Array.isArray(body)) return this.mountErrorResponseConflict();

        const bodyWithoutId = body
            ? body.map((item: Record<string, any>) => ({
                  type: options.type,
                  id: item?.id,
                  attributes: {
                      ...Object.fromEntries(
                          Object.entries(item).filter(
                              ([key]) =>
                                  key !== 'id' &&
                                  key !== 'type' &&
                                  (!relationships?.type || key !== mapRelationTypeToModelType(relationships.type)),
                          ),
                      ),
                  },
                  relationships: relationships
                      ? {
                            [relationships.type]: {
                                links: {
                                    self: `http://localhost:3000/${mapRelationTypeToModelType(options.type)}/${
                                        item.id
                                    }/relationships/${relationships.type}`,
                                    related: `http://localhost:3000/${mapRelationTypeToModelType(options.type)}/${
                                        item.id
                                    }/${relationships.type}`,
                                },
                                data: relationships.includeData
                                    ? item[mapRelationTypeToModelType(relationships.type)].map((relation: any) => ({
                                          id: relation.id,
                                          type: relationships.type,
                                          attributes: {
                                              ...Object.fromEntries(
                                                  Object.entries(relation).filter(([key]) => key !== 'id'),
                                              ),
                                          },
                                      }))
                                    : undefined,
                            },
                        }
                      : null,
              }))
            : ([] as JsonAPIBodyDataType<any>[]);

        const response: JsonAPIBodyResponseArray<T> = {
            data: bodyWithoutId as JsonAPIBodyDataType<T>[],
            links: {
                self: `http://localhost:3000/${options.linkSelf}`,
            },
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: statusCode,
            body: JSON.stringify(response),
        };
    }

    public mountSuccessResponseRelationshipArray<T>({
        options,
        body,
    }: MountSuccessResponseType): ControllerResponseJsonAPI {
        const bodyWithoutId = body
            ? body.map((item: Record<string, any>) => ({
                  type: options.type,
                  id: item?.id,
                  attributes: {
                      ...Object.fromEntries(Object.entries(item).filter(([key]) => key !== 'id')),
                  },
              }))
            : ([] as JsonAPIBodyDataType<any>[]);

        const response: JsonAPIBodyResponseArray<T> = {
            data: bodyWithoutId as JsonAPIBodyDataType<T>[],
            links: {
                self: `http://localhost:3000/${options.baseLinkReference}/relationships/${options.linkSelf}`,
                related: `http://localhost:3000/${options.baseLinkReference}/${options.linkSelf}`,
            },
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: StatusCodeEnum.success,
            body: JSON.stringify(response),
        };
    }

    public mountErrorResponseForbidden(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.forbidden,
                    title: 'Forbidden',
                    detail: `Unsupported request according to the current state of the resource.${
                        errorMessage ? 'Detail: ' + errorMessage : ''
                    }`,
                },
            ],
        };

        return {
            statusCode: StatusCodeEnum.forbidden,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseNotFound(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.badRequest,
                    title: 'Not Found',
                    detail: `The related resource does not exist. Ensure sending the right parameters.${
                        errorMessage ? 'Detail: ' + errorMessage : ''
                    }`,
                },
            ],
        };

        return {
            statusCode: StatusCodeEnum.badRequest,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseConflict(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.conflict,
                    title: 'Conflict',
                    detail: `The request violets the server constraints.${
                        errorMessage ? 'Detail: ' + errorMessage : ''
                    }`,
                },
            ],
        };

        return {
            statusCode: StatusCodeEnum.conflict,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseUnsupportedMediaType(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.unsuporttedMediaType,
                    title: 'Unsupported Media Type',
                    detail: `The request is not appropriate accordingly to the server rules.${
                        errorMessage ? 'Detail: ' + errorMessage : ''
                    }`,
                },
            ],
        };

        return {
            statusCode: StatusCodeEnum.unsuporttedMediaType,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseInternalServer(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.internalServerError,
                    title: 'Internal server error',
                    detail: `An unexpected error occured during the proccess.${
                        errorMessage ? 'Detail: ' + errorMessage : ''
                    }`,
                },
            ],
        };

        return {
            statusCode: StatusCodeEnum.internalServerError,
            body: JSON.stringify(errorResponse),
        };
    }
}

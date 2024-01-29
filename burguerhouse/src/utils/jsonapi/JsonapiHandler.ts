import { StatusCodeEnum } from '../commonEnums';
import {
    ControllerResponseJsonAPI,
    JsonAPIBodyDataType,
    JsonAPIBodyErrorResponse,
    JsonAPIBodyResponse,
    JsonAPIBodyResponseArray,
    JsonAPIProjectTypesEnum,
    MountSuccessResponseType,
    RelationshipType,
} from './typesJsonapi';
import { mapRelationTypeToModelType, mapRelationTypeToRoute, removeKeysFromObject } from './utilsJsonapi';

export class JSONAPIHandler {
    private contentType = 'application/vnd.api+json';

    private readonly availableDataPrimaryKeys: string[] = ['data', 'meta', 'links', 'included', 'errors', 'jsonapi'];
    private readonly availableQueryParams: string[] = ['include', 'fields', 'sort', 'page', 'filter'];

    private readonly commonJsonAPI: Record<string, string | string[]> = {
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

        const { relations } = relationships ?? {};

        const firstLevelRelations = relations?.map((relation) => relation.split('.')[0]) ?? [];

        const keysToRemove = relations
            ? [
                  'id',
                  ...firstLevelRelations.map((relation) =>
                      mapRelationTypeToModelType(relation as JsonAPIProjectTypesEnum).toString(),
                  ),
              ]
            : ['id'];

        const bodyWithoutId: Record<string, any> | null = body ? removeKeysFromObject(body, keysToRemove) : null;

        const response: JsonAPIBodyResponse<T> = {
            data: bodyWithoutId
                ? {
                      type: options.type,
                      id: dataBodyId,
                      attributes: {
                          ...(bodyWithoutId as T),
                      },
                      relationships: this.getRelationships(relationships, options.type, body),
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

        const keysToRemove = relationships
            ? ['id', 'type', mapRelationTypeToModelType(relationships.relations[0] as JsonAPIProjectTypesEnum)]
            : ['id'];

        const bodyWithoutId = body
            ? body.map((item: Record<string, any>) => ({
                  type: options.type,
                  id: item?.id,
                  attributes: {
                      ...removeKeysFromObject(item, keysToRemove),
                  },
                  relationships: this.getRelationships(relationships, options.type, item),
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

    private getRelationships(
        relationships: RelationshipType | null,
        parentType: JsonAPIProjectTypesEnum,
        body: Record<string, any> | null | undefined,
    ): Record<string, any> | undefined {
        if (!relationships) return undefined;

        return relationships.relations.reduce((acm: Record<string, any>, relation: string) => {
            return {
                ...acm,
                [relation]: {
                    links: {
                        self: `http://localhost:3000/${mapRelationTypeToRoute(parentType)}/${
                            body?.id
                        }/relationships/${mapRelationTypeToRoute(relation as JsonAPIProjectTypesEnum)}`,
                        related: `http://localhost:3000/${mapRelationTypeToRoute(parentType)}/${
                            body?.id
                        }/${mapRelationTypeToRoute(relation as JsonAPIProjectTypesEnum)}`,
                    },
                    data:
                        relationships.includeData && body
                            ? body[mapRelationTypeToModelType(relation as JsonAPIProjectTypesEnum)].map(
                                  (relation: any) => ({
                                      id: relation.id,
                                      type: relation,
                                      attributes: {
                                          ...removeKeysFromObject(relation, ['id']),
                                      },
                                  }),
                              )
                            : undefined,
                },
            };
        }, {});
    }

    public mountSuccessResponseRelationshipArray<T>({
        options,
        body,
    }: MountSuccessResponseType): ControllerResponseJsonAPI {
        const bodyWithoutId =
            body && body?.length > 0
                ? body.map((item: Record<string, any>) => ({
                      type: options.type,
                      id: item?.id,
                      attributes: {
                          ...removeKeysFromObject(item, ['id']),
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
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: StatusCodeEnum.forbidden,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseBadRequest(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.badRequest,
                    title: 'Bad Request',
                    detail: `The request is not appropriate to the API rules. Ensure sending the right parameters.${
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: StatusCodeEnum.badRequest,
            body: JSON.stringify(errorResponse),
        };
    }

    public mountErrorResponseNotFound(errorMessage?: string): ControllerResponseJsonAPI {
        const errorResponse: JsonAPIBodyErrorResponse = {
            errors: [
                {
                    status: StatusCodeEnum.notFound,
                    title: 'Not Found',
                    detail: `The related resource does not exist. Ensure sending the right parameters.${
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: StatusCodeEnum.notFound,
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
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
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
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
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
                        errorMessage ? ' Detail: ' + errorMessage : ''
                    }`,
                },
            ],
            jsonapi: {
                ...this.commonJsonAPI,
            },
        };

        return {
            statusCode: StatusCodeEnum.internalServerError,
            body: JSON.stringify(errorResponse),
        };
    }
}

export enum HTTPMethodEnum {
    POST = 'POST',
    GET = 'GET',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum StatusCodeEnum {
    created = 201,
    success = 200,
    noContent = 204,
    badRequest = 400,
    forbidden = 403,
    notFound = 404,
    conflict = 409,
    unsuporttedMediaType = 415,
    internalServerError = 500,
}

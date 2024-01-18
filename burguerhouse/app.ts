import * as schema from './prisma/schema.prisma';
import * as x from './node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node';
import * as l from './node_modules/.prisma/client/libquery_engine-rhel-openssl-1.0.x.so.node';
import { lambdaUserHandler } from './src/handlers/UserHandler';
import { lambdaIngredientHandler } from './src/handlers/IngredientHandler';
import { lambdaSnackHandler } from './src/handlers/SnackHandler';

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

export { lambdaUserHandler, lambdaIngredientHandler, lambdaSnackHandler };

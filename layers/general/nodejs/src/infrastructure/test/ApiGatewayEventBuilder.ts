import { APIGatewayEvent } from 'aws-lambda';

export const ApiGatewayEventBuilder = ({
  body = {},
  headers = {},
  queryStringParameters = {},
  pathParameters = {}
} = {}) => {
  return {
    resource: '/fake',
    path: '/fake',
    httpMethod: 'GET',
    requestContext: {
      resourcePath: '/',
      httpMethod: 'GET',
      path: '/fake/'
    },
    headers,
    multiValueHeaders: {},
    queryStringParameters,
    multiValueQueryStringParameters: null,
    pathParameters,
    stageVariables: null,
    body,
    isBase64Encoded: false
  } as APIGatewayEvent;
};

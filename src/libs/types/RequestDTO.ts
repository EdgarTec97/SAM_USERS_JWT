import { APIGatewayEvent } from 'aws-lambda';

export type RequestDTO<T> = Omit<APIGatewayEvent, 'body'> & { body: T | null };

export type RequestParams<T> = Omit<APIGatewayEvent, 'pathParameters'> & {
  pathParameters: T;
};

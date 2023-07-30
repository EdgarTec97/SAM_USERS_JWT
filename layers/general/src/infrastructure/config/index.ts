declare const process: any;

export const config = {
  deployEnvironment: process.env.DEPLOY_ENVIRONMENT || 'dev',
  secretKey: process.env.SECRET_KEY || 'shhh',
  expiration: Number(process.env.EXPIRATION || 0),
  aws: {
    dynamoDB: {
      users: {
        tableName: process.env.TABLE_NAME || 'users-dev',
        host: process.env.DYNAMOHOST || '127.0.0.1',
        port: process.env.DYNAMO_PORT || '4566'
      }
    },
    region: process.env.AWS_REGION || 'us-east-1',
    userTopic: process.env.TOPIC_ARN,
    bucket: process.env.BUCKET_NAME
  },
  isOffline: process.env.IS_OFFLINE == 'true' // Variable IS_OFFLINE is always set true when the app runs locally by the serverless-offline plugin (sam local start-api).
};

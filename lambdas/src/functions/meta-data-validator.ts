import { Handler, S3Event } from 'aws-lambda';

const MetaDataValidator = async (event: S3Event): Promise<Object> => {
  try {
    for (const record of event.Records) {
      console.info(JSON.stringify(record));
    }
  } catch (error) {
    console.error('Error in the meta-data validator lambda [fn]', error);
  }

  if (event.Records[0].s3.object.key.toLowerCase().includes('pantalla'))
    throw new Error('Invalid format');

  return { message: JSON.stringify(event), data: 'SUCCESS_AWS_ECV' };
};

export const handler: Handler = MetaDataValidator;

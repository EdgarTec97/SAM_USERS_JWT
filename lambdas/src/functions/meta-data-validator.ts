import { Handler, S3Event } from 'aws-lambda';

const MetaDataValidator = async (event: S3Event): Promise<void> => {
  try {
    for (const record of event.Records) {
      console.info(JSON.stringify(record));
    }
  } catch (error) {
    console.error('Error in the meta-data validator lambda [fn]', error);
  }

  return;
};

export const handler: Handler = MetaDataValidator;

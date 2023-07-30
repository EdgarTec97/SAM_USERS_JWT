import { Handler } from 'aws-lambda';

const MetaDataValidator = async (event: any): Promise<void> => {
  try {
    console.info(event);
  } catch (error) {
    console.error('Error in the meta-data validator lambda [fn]', error);
  }

  return;
};

export const handler: Handler = MetaDataValidator;

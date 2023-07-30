import { Handler } from 'aws-lambda';
import { SESEmailService } from '@general';

const EmailValidator = async (event: any): Promise<void> => {
  try {
    console.info(event);
  } catch (error) {
    console.error('Error in the email validator lambda [fn]', error);
  }

  return;
};

export const handler: Handler = EmailValidator;

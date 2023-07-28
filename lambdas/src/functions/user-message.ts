import { SQSEvent, Handler } from 'aws-lambda';
import { DomainError } from '@general';

const notification = async (event: SQSEvent): Promise<void> => {
  try {
    for (const record of event.Records) {
      const messageBody = record.body;
      console.info(`Received message from SQS: ${messageBody}`);
    }
  } catch (error: DomainError | any) {
    console.error(error);
  }

  return;
};

export const handler: Handler = notification;

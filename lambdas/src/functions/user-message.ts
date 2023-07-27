import { SQSEvent, Handler, DomainError } from '/opt/infra/index';

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

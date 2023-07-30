import { SQSEvent, Handler } from 'aws-lambda';
import { DomainError, SESEmailService, UserPrimitives } from '@general';

const notification = async (event: SQSEvent): Promise<void> => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);

      console.info(`Received message from SQS: ${body.Message}`);

      const user: UserPrimitives = JSON.parse(body.Message);

      await SESEmailService.send({
        destination: user.email,
        message: 'Should validate your email',
        subject: 'User-Service Email-Validation'
      });
    }
  } catch (error: DomainError | any) {
    console.error(error);
  }

  return;
};

export const handler: Handler = notification;

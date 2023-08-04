import { IEmailService, SESParams } from '@/domain/services/email.service';
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput
} from '@aws-sdk/client-ses';
import { config } from '@/infrastructure/config';

export class SESEmailService implements IEmailService<Boolean> {
  private static instance?: IEmailService<Boolean>;
  private sesClient: SESClient;

  private constructor() {
    this.sesClient = new SESClient({ region: config.aws.region });
  }

  static getInstance(): IEmailService<Boolean> {
    if (SESEmailService.instance) return SESEmailService.instance;

    SESEmailService.instance = new SESEmailService();

    return SESEmailService.instance;
  }

  async send(data: SESParams): Promise<Boolean> {
    try {
      const params: SendEmailCommandInput = {
        Destination: {
          ToAddresses: [data.destination]
        },
        Message: {
          Body: {
            Text: { Data: data.message }
          },
          Subject: { Data: data.subject }
        },
        Source: config.aws.adminEmail
      };

      return (await this.sesClient.send(new SendEmailCommand(params))) && true;
    } catch (error) {
      console.info(error);
      return false;
    }
  }
}

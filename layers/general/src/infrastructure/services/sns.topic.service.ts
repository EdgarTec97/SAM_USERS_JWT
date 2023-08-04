import { ITopicService } from '@/domain/services/topic.service';
import {
  SNSClient,
  PublishCommand,
  SNSClientConfig,
  PublishCommandInput
} from '@aws-sdk/client-sns';
import { config } from '@/infrastructure/config';

export class SNSTopicService implements ITopicService<Boolean> {
  private static instance?: ITopicService<Boolean>;
  private snsClient: SNSClient;

  private constructor() {
    const SnSConfig: SNSClientConfig = {
      region: config.aws.region
    };

    if (config.isOffline) {
      SnSConfig.endpoint = `http://${config.aws.dynamoDB.users.host}:${config.aws.dynamoDB.users.port}`;
    }

    this.snsClient = new SNSClient(SnSConfig);
  }

  static getInstance(): ITopicService<Boolean> {
    if (SNSTopicService.instance) return SNSTopicService.instance;

    SNSTopicService.instance = new SNSTopicService();

    return SNSTopicService.instance;
  }

  async send(message: string): Promise<Boolean> {
    try {
      const params: PublishCommandInput = {
        TopicArn: config.aws.userTopic,
        Message: message
      };

      await this.snsClient.send(new PublishCommand(params));
      console.info('Message sent to SNS topic.');
      return true;
    } catch (error: any) {
      console.error(
        `Error publishing message to SNS topic: ${error.toString()}`
      );
      return false;
    }
  }
}

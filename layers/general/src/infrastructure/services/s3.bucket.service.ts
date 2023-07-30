import { IBucketService, BucketParams } from '@/domain/services/bucket.service';
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput
} from '@aws-sdk/client-s3';
import { config } from '@/infrastructure/config';

export class S3BucketService implements IBucketService<Boolean> {
  private static instance?: IBucketService<Boolean>;
  private s3Client: S3Client;

  private constructor() {
    const SnSConfig: S3ClientConfig = {
      region: config.aws.region
    };

    if (config.isOffline) {
      SnSConfig.endpoint = `http://${config.aws.dynamoDB.users.host}:${config.aws.dynamoDB.users.port}`;
    }

    this.s3Client = new S3Client(SnSConfig);
  }

  static getInstance(): IBucketService<Boolean> {
    if (S3BucketService.instance) return S3BucketService.instance;

    S3BucketService.instance = new S3BucketService();

    return S3BucketService.instance;
  }

  async send(data: BucketParams): Promise<Boolean> {
    try {
      const params: PutObjectCommandInput = {
        Bucket: config.aws.bucket,
        Key: data.filePath,
        Body: data.file,
        ACL: 'public-read'
      };

      await this.s3Client.send(new PutObjectCommand(params));
      return true;
    } catch (error: any) {
      console.error(
        `Error uploading new file to S3 Bucket: ${error.toString()}`
      );
      return false;
    }
  }
}

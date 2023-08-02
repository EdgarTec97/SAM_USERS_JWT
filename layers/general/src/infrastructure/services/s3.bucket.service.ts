import { IBucketService, BucketParams } from '@/domain/services/bucket.service';
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput
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

  async get<S>(fileName: string, bucket?: string): Promise<S> {
    try {
      const params: GetObjectCommandInput = {
        Bucket: bucket || config.aws.bucket,
        Key: fileName
      };
      const data = await this.s3Client.send(new GetObjectCommand(params));
      return data.Body as S;
    } catch (err) {
      console.error('Error fetching S3 object:', err);
      throw err;
    }
  }

  async send(data: BucketParams, bucket?: string): Promise<Boolean> {
    try {
      const params: PutObjectCommandInput = {
        Bucket: bucket || config.aws.bucket,
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

import { Handler, S3Event, Callback, Context } from 'aws-lambda';
import { S3BucketService, config } from '@general';

const metaDataValidator = async (
  event: S3Event,
  _context: Context,
  callback: Callback
) => {
  try {
    const originalBucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    let getObjectResponse = await S3BucketService.get(key, originalBucket);

    //getObjectResponse = await getObjectResponse.transformToString();

    let getWatermarkResponse = await S3BucketService.get(
      config.aws.waterMarkImg
    );

    //getWatermarkResponse = await getWatermarkResponse.transformToString();

    const watermarkedImage = applyWatermark(
      getObjectResponse,
      getWatermarkResponse
    );

    const uploadKey = `watermarked_${key}`;
    await S3BucketService.send({ filePath: uploadKey, file: watermarkedImage });

    callback(null, {
      success: true,
      message: `Object written to ${config.aws.bucket}`
    });
  } catch (error: any) {
    console.error('Error:', error);
    callback(error);
  }
};

declare const Buffer: any;

function applyWatermark<T>(imageData: T, watermarkData: T): T {
  const combinedImage = Buffer.concat([imageData, watermarkData]);

  return combinedImage;
}

export const handler: Handler = metaDataValidator;

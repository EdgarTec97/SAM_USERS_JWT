import { Handler, S3Event, Callback, Context } from 'aws-lambda';
import { S3BucketService, config, Jimp } from '@general';

const fs = require('fs');
const path = require('path');
const directory = '/tmp/';

const metaDataValidator = async (
  event: S3Event,
  _context: Context,
  callback: Callback
) => {
  try {
    const originalBucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    // let getObjectResponse = await S3BucketService.get(key, originalBucket);

    // getObjectResponse = await getObjectResponse.transformToString(); // transformToString('base64')

    // let getWatermarkResponse = await S3BucketService.get(
    //   config.aws.waterMarkImg
    // );

    // getWatermarkResponse = await getWatermarkResponse.transformToString();

    // const watermarkedImage = applyWatermark(
    //   getObjectResponse,
    //   getWatermarkResponse
    // );

    const [image, logo] = await Promise.all([
      Jimp.read(`https://${originalBucket}.s3.amazonaws.com/${key}`),
      Jimp.read(
        `https://${config.aws.bucket}.s3.amazonaws.com/${config.aws.waterMarkImg}`
      )
    ]);

    logo.resize(image.bitmap.width / 10, Jimp.AUTO);

    const xMargin = (image.bitmap.width * 1) / 100;
    const yMargin = (image.bitmap.width * 1) / 100;

    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;

    const data = image.composite(logo, X, Y, [
      {
        mode: Jimp.BLEND_SCREEN,
        opacitySource: 0.1,
        opacityDest: 1
      }
    ]);

    const uploadKey = `watermarked-${key}`;

    data.write(`${directory}${uploadKey}`);

    const tmpData = fs.readFileSync(`${directory}${uploadKey}`);

    await S3BucketService.send({ filePath: uploadKey, file: tmpData });

    await tmpCleanup();

    callback(null, {
      success: true,
      message: `Object written to ${config.aws.bucket}`
    });
  } catch (error: any) {
    console.error('Error:', error);
    callback(error);
  }
};

const tmpCleanup = async () => {
  fs.readdir(directory, (err: any, files: any[]) => {
    return new Promise<void>((resolve, reject) => {
      if (err) reject(err);

      for (const file of files) {
        const fullPath = path.join(directory, file);
        fs.unlink(fullPath, (err: any) => {
          if (err) reject(err);
        });
      }
      resolve();
    });
  });
};

export const handler: Handler = metaDataValidator;

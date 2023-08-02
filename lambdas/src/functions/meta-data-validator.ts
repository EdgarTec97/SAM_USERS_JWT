import { Handler, S3Event } from 'aws-lambda';
import { S3BucketService, config } from '@general';

const MetaDataValidator = async (event: S3Event): Promise<Object> => {
  console.info('Start processing the image');

  console.info(JSON.stringify(event, null, 2));

  // Handle each incoming S3 object in the event
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;

        if (!['png', 'jpg', 'jpeg', 'webbp'].includes(key.split('.')[1]))
          throw new Error(
            'Invalid Suffix, should send one of these: [png, jpg, jpeg, webbp]'
          );

        await watermarkVideo(bucket, key);
      } catch (err) {
        console.error(`Handler error: ${err}`);
      }
    })
  );

  return { message: 'Finished image workflow' };
};

/* FFPMEG WORFLOW */
const { exec } = require('child_process');

const fs = require('fs');
const path = require('path');

const watermarkVideo = async (bucket: string, key: string) => {
  const ffmpegPath = '/opt/bin/ffmpeg';
  const ffTmp = '/tmp';

  // Get signed URL for source object
  const Key = decodeURIComponent(key.replace(/\+/g, ' '));

  // Get object from S3 bucket
  const data = await S3BucketService.get(Key, bucket);

  //Get watermark file from S3 bucket
  const watermarkData = await S3BucketService.get(config.aws.waterMarkImg);

  // Save original to tmp directory
  const tempFile = `${ffTmp}/${Key}`;
  console.info('Saving downloaded file to ', tempFile);
  fs.writeFileSync(tempFile, data.Body);

  // Save watermark file to tmp directory
  const tempWatermark = `${ffTmp}/${config.aws.waterMarkImg}`;
  console.info('Saving downloaded file to ', tempWatermark);
  fs.writeFileSync(tempWatermark, watermarkData.Body);

  // Add watermark and save to /tmp
  const outputFilename = `watermark-${Key}`;
  console.info(`Adding watermark and saving to ${outputFilename}`);
  await execPromise(
    `${ffmpegPath} -i "${tempFile}" -i "${tempWatermark}" -loglevel error -filter_complex overlay ${ffTmp}/${outputFilename}`
  );

  // Read watermarked file from tmp
  console.info('Read tmp file into tmpData');
  const tmpData = fs.readFileSync(`${ffTmp}/${outputFilename}`);
  console.info(`tmpData size: ${tmpData.length}`);

  // Upload tmpData to Output bucket
  console.info(`Uploading ${outputFilename} to ${config.aws.bucket}`);
  await S3BucketService.send({ filePath: outputFilename, file: tmpData });
  console.info(`Object written to ${config.aws.bucket}`);

  // Clean up temp files
  console.info('Cleaning up temporary files');
  await tmpCleanup();
};

// Promisified wrapper for child_process.exec
const execPromise = async (command: any) => {
  return new Promise<void>((resolve, reject) => {
    const ls = exec(command, function (error: any, stdout: any, stderr: any) {
      if (error) {
        console.info('Error: ', error);
        reject(error);
      }
      if (stdout) console.info('stdout: ', stdout);
      if (stderr) console.info('stderr: ', stderr);
    });

    ls.on('exit', (code: number) => {
      if (code != 0) console.info('execPromise finished with code ', code);
      resolve();
    });
  });
};

// Deletes all files in a directory
const tmpCleanup = async () => {
  const directory = '/tmp/';

  console.info('Starting tmpCleanup');
  fs.readdir(directory, (err: any, files: any[]) => {
    return new Promise<void>((resolve, reject) => {
      if (err) reject(err);

      console.info('Deleting: ', files);
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

export const handler: Handler = MetaDataValidator;

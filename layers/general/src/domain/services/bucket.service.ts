export type BucketParams = {
  file: any;
  filePath: string;
};

export interface IBucketService<T> {
  send(params: BucketParams): Promise<T>;
}

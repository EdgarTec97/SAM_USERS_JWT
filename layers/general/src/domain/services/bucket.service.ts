export type BucketParams = {
  file: any;
  filePath: string;
};

export interface IBucketService<T> {
  send(params: BucketParams, bucket?: string): Promise<T>;
  get<S>(fileName: string, bucket?: string): Promise<S>;
}

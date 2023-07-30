export interface ITopicService<T> {
  send(message: string): Promise<T>;
}

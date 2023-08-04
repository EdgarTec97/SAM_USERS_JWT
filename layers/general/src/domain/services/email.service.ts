export type SESParams = {
  destination: string;
  message: string;
  subject: string;
  origin: string;
};

export interface IEmailService<T> {
  send(params: SESParams): Promise<T>;
}

import jwt from 'jsonwebtoken';
import { config } from '@/infrastructure/config';
import { DayJS } from '@/infrastructure/utils/date';
import { AuthenticationError } from '@/domain/errors/AuthenticationError';
import { GlobalFunctions } from '@/infrastructure/utils';

export class JSONWebTokenAuth {
  private static instance: JSONWebTokenAuth | undefined;
  private secretKey: string;
  private expirationTime: number;

  private constructor() {
    this.secretKey = config.secretKey;
    this.expirationTime = config.expiration;
  }

  static getInstance() {
    if (JSONWebTokenAuth.instance) return JSONWebTokenAuth.instance;

    JSONWebTokenAuth.instance = new JSONWebTokenAuth();

    return JSONWebTokenAuth.instance;
  }

  async sign(
    data: any,
    propertiesToIgnore: Array<string> = []
  ): Promise<string> {
    try {
      data = GlobalFunctions.getNewParams<any>(data, propertiesToIgnore);

      const token = await jwt.sign(
        {
          ...data,
          exp: DayJS.getInstance().getData(
            data.exp || this.expirationTime,
            'hours'
          )
        },
        this.secretKey
      );

      return token;
    } catch (error: any) {
      throw new AuthenticationError(error.toString());
    }
  }

  async verify(token: string): Promise<object | string> {
    try {
      const verifyResult = await jwt.verify(token, this.secretKey as string);

      return verifyResult;
    } catch (error: any) {
      throw new AuthenticationError(error.toString());
    }
  }
}

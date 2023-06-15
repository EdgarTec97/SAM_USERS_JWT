import bcrypt from 'bcrypt';

export class BcryptLib {
  private static instance: BcryptLib | undefined;

  private constructor() {}

  static getInstance() {
    if (BcryptLib.instance) return BcryptLib.instance;

    BcryptLib.instance = new BcryptLib();
    return BcryptLib.instance;
  }

  async encryptValue(toEncrypt: string, saltRounds: number): Promise<string> {
    const newEncryptedValue = await bcrypt.hash(toEncrypt, saltRounds);

    return newEncryptedValue;
  }

  async verifyEncryptValue(
    normalValue: string,
    encryptedValue: string
  ): Promise<boolean> {
    const verifyValues = await bcrypt.compare(normalValue, encryptedValue);

    return verifyValues;
  }
}

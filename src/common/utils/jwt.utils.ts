import * as jwt from 'jsonwebtoken';

export function signToken(
  payload: any,
  secret: string,
  options?: jwt.SignOptions,
): string {
  return jwt.sign(payload, secret, options);
}

export function verifyToken<T>(token: string, secret: string): T | null {
  try {
    const data = jwt.verify(token, secret);

    return data;
  } catch (err) {
    return null;
  }
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}

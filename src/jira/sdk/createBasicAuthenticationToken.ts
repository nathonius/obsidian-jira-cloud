import { Base64Encoder } from './base64Encoder';

export function createBasicAuthenticationToken(
  username?: string,
  key?: string,
) {
  const token = Base64Encoder.encode(`${username}:${key}`);

  return `Basic ${token}`;
}

import { RequestUrlResponse } from 'obsidian';

export function LoggerMiddleware(response: RequestUrlResponse) {
  console.debug(response);
}

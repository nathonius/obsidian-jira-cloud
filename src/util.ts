import { RequestUrlResponse } from 'obsidian';

export function removeKeys<T extends object>(
  obj: T | undefined,
  keys: readonly string[] = [],
  removeNullish = true,
): Exclude<T, (typeof keys)[number]> {
  if (!obj) {
    return obj as any;
  }
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) =>
        !keys.includes(k) &&
        (!removeNullish || (v !== null && v !== undefined)),
    ),
  ) as Exclude<T, (typeof keys)[number]>;
}

export function isFailureResponse(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 600;
}

export enum JiraAPIErrorReason {
  NotInitialized = 'Attempted to access jira before initialization.',
  Unauthorized = 'Unauthorized response from API.',
  Other = 'Generic error reason.',
}

export class JiraAPIError extends Error {
  public readonly reason: JiraAPIErrorReason;
  public readonly response?: RequestUrlResponse;
  constructor(
    reason: JiraAPIErrorReason | number,
    response?: RequestUrlResponse,
  ) {
    super(typeof reason === 'number' ? `HTTP Error status: ${reason}` : reason);
    this.reason =
      typeof reason === 'number' ? JiraAPIErrorReason.Other : reason;
    this.response = response;
  }
}

import { BaseClient, Callback, Config, RequestConfig } from 'jira.js';
import { IssueSearch, Issues } from 'jira.js/out/version3';
import { RequestUrlParam, requestUrl } from 'obsidian';

import { createBasicAuthenticationToken } from './createBasicAuthenticationToken';

export class ObsidianJiraClient extends BaseClient {
  issues = new Issues(this);
  issueSearch = new IssueSearch(this);

  // Override internal axios config
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: never,
    telemetryData?: any,
  ): Promise<T>;
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: Callback<T>,
    telemetryData?: any,
  ): Promise<void>;
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: Callback<T> | never,
  ): Promise<void | T> {
    try {
      const obsidianRequestConfig: RequestUrlParam = {
        url: `${this.config.host}${requestConfig.url}`,
        method: requestConfig.method,
        headers: {
          Authorization: createBasicAuthenticationToken(
            this.config.authentication?.basic?.email,
            this.config.authentication?.basic?.apiToken,
          ),
          ...(requestConfig.headers as Record<string, string>),
        },
      };

      const response = await requestUrl(obsidianRequestConfig);

      const callbackResponseHandler =
        callback && ((data: T): void => callback(null, data));
      const defaultResponseHandler = (data: T): T => data;

      const responseHandler = callbackResponseHandler ?? defaultResponseHandler;

      this.config.middlewares?.onResponse?.(response.json);

      return responseHandler(response.json);
    } catch (e: any) {
      const err = e;

      const callbackErrorHandler =
        callback && ((error: Config.Error) => callback(error));
      const defaultErrorHandler = (error: Error) => {
        throw error;
      };

      const errorHandler = callbackErrorHandler ?? defaultErrorHandler;

      this.config.middlewares?.onError?.(err);

      return errorHandler(err);
    }
  }
}

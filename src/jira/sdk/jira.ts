import { BaseClient, Callback, Config, RequestConfig } from 'jira.js';
import {
  IssueSearch,
  IssueTypes,
  Issues,
  Projects,
} from 'jira.js/out/version3';
import {
  JiraAPIError,
  JiraAPIErrorReason,
  isFailureResponse,
  removeKeys,
} from 'src/util';
import { RequestUrlParam, requestUrl } from 'obsidian';

import { Base64Encoder } from './base64Encoder';

/**
 * A Jira client that can only retrieve and search for issues.
 * The Axios client is overridden internally with Obsidian's requestUrl method
 */
export class ObsidianJiraClient extends BaseClient {
  issues = new Issues(this);
  issueSearch = new IssueSearch(this);
  issueTypes = new IssueTypes(this);
  projects = new Projects(this);

  /**
   * Overrides the internal axios config, replacing it with requestUrl,
   * which bypasses Obsidian's CORS restrictions.
   */
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: never,
  ): Promise<T>;
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: Callback<T>,
  ): Promise<void>;
  async sendRequest<T>(
    requestConfig: RequestConfig,
    callback: Callback<T> | never,
  ): Promise<void | T> {
    try {
      const params = new URLSearchParams(removeKeys(requestConfig.params));
      let expandParam: string | null = params.get('expand');
      if (!expandParam) {
        expandParam = 'renderedFields';
      } else {
        expandParam = [...expandParam.split(','), 'renderedFields'].join(',');
      }
      params.set('expand', expandParam);

      const obsidianRequestConfig: RequestUrlParam = {
        url: `${this.config.host}${requestConfig.url}?${params.toString()}`,
        method: requestConfig.method,
        headers: {
          Authorization: this.createBasicAuthenticationToken(
            this.config.authentication?.basic?.email,
            this.config.authentication?.basic?.apiToken,
          ),
          ...(requestConfig.headers as Record<string, string>),
          'X-Atlassian-Token': 'no-check', // This bypasses Jira's XSRF protection on some endpoints
          'User-Agent': 'obsidian.md', // For other endpoints, we need to change the user agent
        },
        throw: false,
      };

      if (requestConfig.data) {
        obsidianRequestConfig.body = JSON.stringify(requestConfig.data);
        obsidianRequestConfig.contentType = 'application/json';
      }

      console.log(obsidianRequestConfig);

      const response = await requestUrl(obsidianRequestConfig);

      /**
       * For anonymous endpoints, the status will still be 200, even if unauthorized
       * so we should throw this error if we see this specific header
       */
      if (response.headers['x-seraph-loginreason'] === 'AUTHENTICATED_FAILED') {
        throw new JiraAPIError(JiraAPIErrorReason.Unauthorized, response);
      }

      if (isFailureResponse(response.status)) {
        console.error(response);
        throw new JiraAPIError(response.status, response);
      }

      const callbackResponseHandler =
        callback && ((data: T): void => callback(null, data));
      const defaultResponseHandler = (data: T): T => data;

      const responseHandler = callbackResponseHandler ?? defaultResponseHandler;

      this.config.middlewares?.onResponse?.(response.json);

      return responseHandler(response.json);
    } catch (e: unknown) {
      const callbackErrorHandler =
        callback && ((error: Config.Error) => callback(error));
      const defaultErrorHandler = (error: Error) => {
        throw error;
      };

      const errorHandler = callbackErrorHandler ?? defaultErrorHandler;

      this.config.middlewares?.onError?.(e as Config.Error);

      return errorHandler(e as Config.Error);
    }
  }

  private createBasicAuthenticationToken(username?: string, key?: string) {
    const token = Base64Encoder.encode(`${username}:${key}`);

    return `Basic ${token}`;
  }
}

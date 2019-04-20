import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable} from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { publishLast } from 'rxjs/operators/publishLast';
import { refCount } from 'rxjs/operators/refCount';
import { timeout } from 'rxjs/operators/timeout';
import { APIErrorElement, APIResponse } from '../interfaces/api-response.interface';
import { environment } from '../../../../../../src/environments/environment';
import { _throw } from 'rxjs/observable/throw';

export enum ApiRequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  HEAD = 'head',
  OPTIONS = 'options',
}

@Injectable()
export class ApiService {

  private _isAuthorized$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(protected http: HttpClient, protected config: ConfigService) {
  }

  /**
   * @description Headers for requests
   */
  private errorMapping(response: APIResponse): APIErrorElement {
    if (!response.errorCode) {
      return {
        code: 'unknown-error',
        data: {
          title: 'Error',
          messages: ['An unknown error occurred.'],
        },
      };
    }
    const errors: APIErrorElement = {
      code: response.errorCode,
      data: {
        title: 'Error',
        messages: [],
      },
    };
    for (let message of response.errorMessages) {
      if (message.length > 200) {
        message = message.substring(0, 200) + '...';
      }
      errors.data.messages.push(message);
    }
    return errors;
  }

  /**
   * @description Sends a request to the server
   */
  protected request(method: ApiRequestMethod, url: string, body: any = null): Observable<any> {
    return this.http.request(method as string, url, {
      body,
      headers: this.headers,
      observe: 'events',
      withCredentials: !this.config.environment.production,
    }).pipe(
      timeout(10000),
      publishLast(),
      refCount(),
      catchError((error) => {
        if (error.status === 401) {
          if (environment.production) {
            window.location.href = this.config.config.project.loginUrl;
          } else {
            alert('You are not logged in!');
          }
        }
        return _throw(error.error ? this.errorMapping(error.error) : null);
      }),
      map((response: HttpResponse<any>) => {
        const apiResponse: APIResponse = response.body;
        if (typeof apiResponse.success === 'undefined') {
          return apiResponse;
        }
        if (apiResponse.success) {
          return apiResponse.result;
        } else {
          throw apiResponse ? this.errorMapping(apiResponse) : null;
        }
      }),
    );
  }

  get(url: string, params: any = {}): Promise<any> {
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        urlParams.set(key, params[key]);
      }
    }
    if (urlParams.toString() !== '') {
      url = url + '?' + urlParams.toString();
    }
    return this.request(ApiRequestMethod.GET, url, null).toPromise();
  }

  post(url: string, body: any = {}): Promise<any> {
    return this.request(ApiRequestMethod.POST, url, body).toPromise();
  }

  put(url: string, body: any = {}): Promise<any> {
    return this.request(ApiRequestMethod.PUT, url, body).toPromise();
  }

  delete(url: string): Promise<any> {
    return this.request(ApiRequestMethod.DELETE, url, null).toPromise();
  }

  patch(url: string, body: any = {}): Promise<any> {
    return this.request(ApiRequestMethod.PATCH, url, body).toPromise();
  }

  head(url: string): Promise<any> {
    return this.request(ApiRequestMethod.HEAD, url, null).toPromise();
  }

  options(url: string): Promise<any> {
    return this.request(ApiRequestMethod.OPTIONS, url, null).toPromise();
  }

}

import { Injectable } from '@angular/core';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  private axiosInstance;

  constructor() {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    this.axiosInstance = axios.create({
      baseURL: environment.apiUrl
    });
    this.axiosInstance.interceptors.request.use(function (config) {
        const token = sessionStorage.getItem('token');
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
        return config;
    });
  }

  // Make an Axios GET request
  public get<T>(url: string): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
      this.axiosInstance.get<T>(url)
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(error.response?.data || 'Server error');
        });
    });
  }

  // Make an Axios POST request
  public post<T>(url: string, data: any): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Access-Control-Allow-Origin': '*',
        }
        };
      this.axiosInstance.post<T>(url, data, config)
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(error.response?.data || 'Server error');
        });
    });
  }
  // Make an Axios GET request
  public delete<T>(url: string, data: any): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
        const headers =  {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
      this.axiosInstance.delete<T>(url, {headers, data})
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(error.response?.data || 'Server error');
        });
    });
  }
  public update<T>(url: string, data: any): Observable<T> {
    return new Observable<T>((observer: Observer<T>) => {
        const headers =  {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
      this.axiosInstance.put<T>(url, data , {headers})
        .then((response: AxiosResponse<T>) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: AxiosError) => {
          observer.error(error.response?.data || 'Server error');
        });
    });
  }
}

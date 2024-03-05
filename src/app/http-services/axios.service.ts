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
      this.axiosInstance.post<T>(url, data)
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

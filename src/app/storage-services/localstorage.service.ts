import {Observable} from 'rxjs';
import {Injectable, NgZone} from '@angular/core';
import { LocalService } from './local.service';
@Injectable()
export class LocalStorageService {
  constructor(
    private _zone: NgZone,
    private loacl_s: LocalService
  ) {
  }

  /**
   * Set given key on browser localStorage
   * @param key
   * @param data
   * @returns {Observable<any>}
   */
  public save(key: string, data: boolean, cacheMinutes: number): Observable<any> {
    return new Observable((observer) => {
      this.loacl_s.save(key, data, cacheMinutes );
      this._zone.run(() => {
        observer.next(true);
        observer.complete();
      });
    });
  }

  /**
   * Get given key from browser localStorage
   * @param key
   * @returns {Observable<any>}
   */
  public load(key: string): Observable<boolean> {
    return this._zone.run(() => {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(
            this.loacl_s.load(key)
          );
          observer.complete();
        }, 0);
      });
    });
  }

  /**
   * Remove given key from browser localStorage
   * @param key
   * @returns {Observable<any>}
   */
  /*
  public clearLocalStoarge(): Observable<any> {
    return new Observable((observer) => {
      this.loacl_s.clearLocalStoarge();
      this._zone.run(() => {
        observer.next();
        observer.complete();
      });
    });
  }*/
}

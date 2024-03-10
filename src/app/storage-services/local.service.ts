import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'

})
export class LocalService {
  
  constructor() {   }


  public saveUserName(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  public getUserName(key: string) :string{
    return sessionStorage.getItem(key)!;
  }
  public removeUserName(key: string) {
    sessionStorage.removeItem(key);
  }
  public clearLogin(key: string) {
    sessionStorage.removeItem(key);
  }
  
  save(key: string, data: boolean, cacheMinutes: number): void {
    const expires = new Date().getTime() + cacheMinutes * 60000;
    const record = { 'isLogin': data, expires };
    sessionStorage.setItem(key, JSON.stringify(record));
  }

  load(key: string): boolean {
    const item = sessionStorage.getItem(key);
    if (!item) return false;

    const record = JSON.parse(item);
    const now = new Date().getTime();
    if (now > record.expires) {
      sessionStorage.removeItem(key);
      return false;
    }
    return record['isLogin']
  }
  public remove(key: string) {
    sessionStorage.removeItem(key);
  }
}

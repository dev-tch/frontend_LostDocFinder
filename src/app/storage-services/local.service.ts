import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'

})
export class LocalService {
  
  constructor() {   }


  public saveToken(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  public getToken(key: string) :string{
    return localStorage.getItem(key)!;
  }
  public removeToken(key: string) {
    localStorage.removeItem(key);
  }
  public clearLocalStoarge() {
    localStorage.clear();
  }
  
  save(key: string, data: boolean, cacheMinutes: number): void {
    const expires = new Date().getTime() + cacheMinutes * 60000;
    const record = { 'isLogin': data, expires };
    localStorage.setItem(key, JSON.stringify(record));
  }

  load(key: string): boolean {
    const item = localStorage.getItem(key);
    if (!item) return false;

    const record = JSON.parse(item);
    const now = new Date().getTime();
    if (now > record.expires) {
      localStorage.removeItem(key);
      return false;
    }
    return record['isLogin']
  }
  public remove(key: string) {
    localStorage.removeItem(key);
  }
}

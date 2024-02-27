import { BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseService {
  protected isLoginSubject = new BehaviorSubject<boolean>(false);
  isLogin$: Observable<boolean> = this.isLoginSubject.asObservable();

  protected csrfTokenSubject = new BehaviorSubject<string>("");
  csrfToken$: Observable<string> = this.csrfTokenSubject.asObservable();

  protected isSavingSubject = new BehaviorSubject<boolean>(false);
  isSaving$: Observable<boolean> = this.isSavingSubject.asObservable();
  protected isRegisteredSubject = new BehaviorSubject<boolean>(false);
  isRegistered$: Observable<boolean> = this.isRegisteredSubject.asObservable();

  constructor() {}

    // Methods to update the properties
    setIsLogin(value: boolean) {
        this.isLoginSubject.next(value);
    }

    setCsrfToken(token: string) {
        this.csrfTokenSubject.next(token);
    }
    setIsRegistred(value: boolean) {
        this.isRegisteredSubject.next(value);
    }
    

    setIsSaving(value: boolean) {
        this.isSavingSubject.next(value);
    }

    // Getter methods
    getIsLogin(): Observable<boolean> {
        return this.isLogin$;
    }

    getCsrfToken(): Observable<string> {
        return this.csrfToken$;
    }

    getIsSaving(): Observable<boolean> {
        return this.isSaving$;
    }
    getIsRegistred(): Observable<boolean> {
        return this.isRegistered$;
    }
}
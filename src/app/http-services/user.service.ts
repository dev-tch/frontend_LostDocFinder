import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlertDialogComponent } from '../notification-tools/alert-dialog/alert-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {signal} from '@angular/core';
import { LocalService } from '../storage-services/local.service';
import { RegisterForm } from '../data-models/form.model';
import { LoginForm } from '../data-models/form.model';
import { ApiToken } from '../data-models/respone.model';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AxiosService } from './axios.service';
import { EMPTY, catchError } from 'rxjs';

//import { error } from 'console';
const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class UserService  {
    public isLoginSig      = signal(false);
    public isRegistredSig  = signal(false);
    public isSavingSig     = signal(false);
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private dialog: MatDialog, private http: HttpClient,
                private local_s: LocalService,
                private axiosService: AxiosService
                )
    {
        if (isPlatformBrowser(this.platformId)) {
            if (this.local_s.load('user') == true )
            {
                //console.log("*************value true");
                //this.local_s.save('user', true, 1200 );
                this.isLoginSig.set(true);
            }
            else if (this.isLoginSig() ==  true)
            {
                this.local_s.save('user', this.isLoginSig() , 1200 );
            }
        }

    }
    /**
     * method to sign up new user 
     */
    postRegister(formObj : RegisterForm)
    {
        const formData = new URLSearchParams();
        this.fillDataSignup(formData, formObj);
        return this.http.post(API_URL + "/api/users", /*formParams.toString()*/formData.toString(),
        {
            headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        }
        ).subscribe(
            {
            next: res => {
                this.isRegistredSig.set(true);
                console.log(this.isRegistredSig);
                console.log(res);
            },
            error: err => {
                console.log(err);
                this.isSavingSig.set(false);
            },
            complete: () => {
                this.isSavingSig.set(false);
            }
            });
    }
    /**
     *  method to log in user
     */
    postLogin(formObj: LoginForm) {
        this.axiosService.get<any>('/sanctum/csrf-cookie')
        .pipe(
            catchError(error => {
            console.error(error);
            console.log('An error occurred while asking CSRF token .');
            this.isSavingSig.set(false);
            return EMPTY; // Return an empty observable to complete immediately
            })
        )
        .subscribe(data => {
            console.log(data);
            // Handle successful response
        });

        /*asking for loging with the geneated session cookie*/
        const formData = new URLSearchParams();
        this.fillDataLogin(formData, formObj);
        this.axiosService.post<any>('/api/login', formData.toString())
        .pipe(
            catchError(error => {
            console.error(error);
            console.log('An error occurred while trying to login .');
            this.isSavingSig.set(false);
            return EMPTY; // Return an empty observable to complete immediately
            })
        )
        .subscribe(data => {
            console.log(data);
            this.isLoginSig.set(true);
            this.isSavingSig.set(false);
            // Handle successful response
        });
    }  
    /**
     *  method to log out user 
     */
    postLogout()
    {
        this.axiosService.post<any>('/api/logout', '')
        .pipe(
            catchError(error => {
            console.error(error);
            console.log('An error occurred while trying to login .');
            this.isSavingSig.set(false);
            return EMPTY; // Return an empty observable to complete immediately
            })
        )
        .subscribe(data => {
            console.log(data);
            this.isLoginSig.set(false);
            this.isSavingSig.set(false);
            // Handle successful response
        });
    }
    /********************
     *  helper methods 
     */
    fillDataSignup(formData: URLSearchParams, formObj:RegisterForm){
        for (const [k, v] of Object.entries(formObj)) {
            formData.set(k, v);
        }
    }
    fillDataLogin(formData: URLSearchParams, formObj:LoginForm){
        for (const [k, v] of Object.entries(formObj)) {
            formData.set(k, v);
        }
    }
}

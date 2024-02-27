import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {AlertDialog} from '../components/alert-dialog/alert-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { BaseService } from './base.service';
import axios  from 'axios';
//import { error } from 'console';
const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
    constructor(private http: HttpClient,
               private dialog: MatDialog) 
    {
        super();
    }
    postRegister(formObj : any)
    {
        let formData = new URLSearchParams();
        this.fillData(formData, formObj);
        return this.http.post(API_URL + "/api/users", /*formParams.toString()*/formData.toString(),
        {
            headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded')
        }
        ).subscribe({
            next: res => {
                this.setIsRegistred(true);
                console.log(this.getIsRegistred());
                console.log(res);
            },
            error: err => {
	            console.log(err);
                this.dialog.open(AlertDialog, {
                    data: {
                      icon: 'error',
                      message: 'an Error occured  while sgnup : view console log'
                    }
                  });
                  this.setIsSaving(false);
	        },
            complete: () => {
                this.setIsSaving(false);
	        }
         });
    }
    defaultHeaders: HttpHeaders = new HttpHeaders('Accept:application/json');
    requestOptions = { headers: this.defaultHeaders, withCredentials: true, withXSRFToken: true};
    async postLogin(formObj: any) {
        try {
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            let formData = new URLSearchParams();
            this.fillData(formData, formObj);
            const url = API_URL + '/sanctum/csrf-cookie';
            // Make the GET request and await its response
            const response = await axios.get(url);
            // Make the POST request after receiving the CSRF token
            const response2 = await axios.post(API_URL + "/api/login", formData.toString());
            // Log the response from the POST request
            let valp:string = response2['config']['headers']['X-XSRF-TOKEN'];
            this.setCsrfToken(valp);
            this.setIsLogin(true);
            this.setIsSaving(false);
            // log the headers
        } catch (error) {
            this.setIsSaving(false)
            this.dialog.open(AlertDialog, {
                data: {
                icon: 'error',
                message: 'an Error occured  while sgin in  : view console log'
                }
            });
            console.log(error);
        }
    }
    async postLogout()
    {
        try {
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            const url = API_URL + '/api/logout';
            // Make the GET request and await its response
            const response = await axios.post(url);
            this.setIsLogin(false);
            this.setIsSaving(false);
            this.setCsrfToken("")
        } catch (error) {
            this.setIsSaving(false);
            this.dialog.open(AlertDialog, {
                data: {
                icon: 'error',
                message: 'an Error occured  while logout  : view console log'
                }
            });
            console.log(error);
        }
    }
    fillData(formData: any, formObj:any){
        for (let key in formObj) {
            if (formObj.hasOwnProperty(key)) {
                formData.set(key, formObj[key]);
            }
        }
    }
    
}

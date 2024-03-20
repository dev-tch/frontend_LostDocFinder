import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {signal} from '@angular/core';
import { LocalService } from '../storage-services/local.service';
import { DocForm, RegisterForm, ReqForm, apiResponse } from '../data-models/form.model';
import { LoginForm } from '../data-models/form.model';
import { Contact } from '../data-models/form.model';
import { ApiToken } from '../data-models/form.model';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AxiosService } from './axios.service';
import { EMPTY, catchError,map} from 'rxjs';
import { Observable , of} from 'rxjs';

const API_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class UserService  {
    public isLoginSig      = signal(false);
    public isRegistredSig  = signal(false);
    public isSavingSig     = signal(false);
    public usernameSig     = signal("");
    public documents: DocForm[] = [];
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private local_s: LocalService,
                private axiosService: AxiosService
                )
    {
        if (isPlatformBrowser(this.platformId)) {
            if (this.local_s.load('user') )
            {
                this.isLoginSig.set(true);
                this.usernameSig.set(this.local_s.getUserName('username'));
            }
            else if (this.isLoginSig() ==  true)
            {
                this.local_s.save('user', this.isLoginSig() , 1200 );
            }
           else {
             console.log("user not connected !!");
             this.isLoginSig.set(false);
           }
       }

    }
    /**
     * method to sign up new user 
     */
    postRegister(formObj : RegisterForm):Observable<apiResponse>
    {
        const formData = new URLSearchParams();
        this.fillDataSignup(formData, formObj);
        return this.axiosService.post<apiResponse>('/users', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                this.isSavingSig.set(false);
                this.isRegistredSig.set(true);
                return data;
            }),
            catchError(err => {
                this.isSavingSig.set(false);
                const data:apiResponse = {error: err.error , message: ""}
                return of(data);           
            })
        )
    }
    /**
     *  method to log in user
     */
    postLogin(formObj: LoginForm) {
        const formData = new URLSearchParams();
        this.fillDataLogin(formData, formObj);
        this.axiosService.post<ApiToken>('/login', formData.toString())
        .pipe(
            map((data: ApiToken) => {
                sessionStorage.setItem('token', data.access_token);
                this.usernameSig.set(data.username);
            }),
            catchError(error => {
            console.error(error);
            this.isSavingSig.set(false);
            return EMPTY; // Return an empty observable to complete immediately
            })
        )
        .subscribe(data => {
            console.log(data);
            this.isLoginSig.set(true);
            this.isSavingSig.set(false);
        });
    }  
    /**
     *  method to log out user 
     */
    postLogout()
    {
        this.axiosService.post<any>('/logout', '')
        .pipe(
            
            catchError(error => {
            console.error(error);
            this.isSavingSig.set(false);
            return EMPTY; // Return an empty observable to complete immediately
            })
        )
        .subscribe(data => {
            console.log(data);
            this.local_s.removeUserName('token');
            this.isLoginSig.set(false);
            this.isSavingSig.set(false);
        });
    }
    /**
     *  method to create new document
     */
    createDocument(formObj: DocForm):Observable<apiResponse>
    {
        const formData = new URLSearchParams();
        this.fillDataDoc(formData, formObj);
        return this.axiosService.post<apiResponse>('/addDoc', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                return of(data);           
            })
        )
    }
    /**
     *  method to get documents
     */
    getDocuments():Observable<DocForm[]>
    {
        return this.axiosService.get<DocForm[]>('/documents')
        .pipe(
            map((data: DocForm[]) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                return EMPTY;           
            })
        )
    }
    /**
     *  method to create document request
     */
    createRequest(formObj: ReqForm):Observable<apiResponse>
    {
        const formData = new URLSearchParams();
        this.fillDataReq(formData, formObj);
        return this.axiosService.post<apiResponse>('/addReq', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                const data:apiResponse = {error: "An error occurred while trying to create Request", message: ""}
                return of(data);           
            })
        )
    }
    /**
     *  method to get document requests
     */
    getRequests():Observable<ReqForm[]>
    {
        return this.axiosService.get<ReqForm[]>('/requests')
        .pipe(
            map((data: ReqForm[]) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                return EMPTY;           
            })
        )
    }
    /**
     *  method to contact of user
     */
    getcontacts(obj: ReqForm):Observable<Contact>
    {
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        return this.axiosService.post<Contact>('/contacts', formData.toString())
        .pipe(
            map((data: Contact) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                return EMPTY;           
            })
        )
    }
    /**
     *  method to delete document
     */
    deleteDocument(obj: DocForm): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataDoc(formData, obj);
        return this.axiosService.delete<apiResponse>('/documents', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                const data:apiResponse = {error: "Document Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    /**
     *  method to update document description
     */
    updateDocument(obj:DocForm , id_doc: string): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataDoc(formData, obj);
        return this.axiosService.update<apiResponse>('/documents/'+id_doc, formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);  
                const data:apiResponse = {error: "Document Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    /**
     *  method to delete document Request
     */
    deleteRequest(obj: ReqForm): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        return this.axiosService.delete<apiResponse>('/requests', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false); 
                const data:apiResponse = {error: "Request Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    /**
     *  method to update description of document request
     */
    updateRequest(obj:ReqForm , id_req: number): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        return this.axiosService.update<apiResponse>('/requests/'+id_req, formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false); 
                const data:apiResponse = {error: "Request Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    /**
     *  method to get description of document
     */
    getDocInfo(obj: ReqForm):Observable<apiResponse>
    {
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        return this.axiosService.post<apiResponse>('/documents/description', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                this.isSavingSig.set(false);

                return data;
            }),
            catchError(error => {
                console.error(error);
                this.isSavingSig.set(false);
                const data:apiResponse = {error: "document description not found!", message: ""}
                return of(data);          
            })
        )
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
    fillDataDoc(formData: URLSearchParams, formObj:DocForm){
        for (const [k, v] of Object.entries(formObj)) {
            formData.set(k, v);
        }
    }
    fillDataReq(formData: URLSearchParams, formObj:ReqForm){
        for (const [k, v] of Object.entries(formObj)) {
            formData.set(k, v);
        }
    }
}

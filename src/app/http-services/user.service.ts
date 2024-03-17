import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
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
                private http: HttpClient,
                private local_s: LocalService,
                private axiosService: AxiosService
                )
    {
        if (isPlatformBrowser(this.platformId)) {
            console.log("enter condition of platerforme" + this.local_s.load('user'))
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
    postRegister(formObj : RegisterForm)
    {
        
        const formData = new URLSearchParams();
        this.fillDataSignup(formData, formObj);
        return this.http.post(API_URL + "/users", formData.toString(),
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
        /*asking for loging with the geneated session cookie*/
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
        this.axiosService.post<any>('/logout', '')
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
            this.local_s.removeUserName('token');
            this.isLoginSig.set(false);
            this.isSavingSig.set(false);
            // Handle successful response
        });
    }
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
                console.log('An error occurred while trying to create document');
                this.isSavingSig.set(false);
                const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                return of(data);           
            })
        )
    }
    getDocuments():Observable<DocForm[]>
    {
        console.log("enter service  get documents");
        return this.axiosService.get<DocForm[]>('/documents')
        .pipe(
            map((data: DocForm[]) => {
                console.log(data);
                console.log("map  data get documents");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to get documents');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                return EMPTY;           
            })
        )
    }

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
                console.log('An error occurred while trying to create Request');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                const data:apiResponse = {error: "An error occurred while trying to create Request", message: ""}
                return of(data);           
            })
        )
    }

    getRequests():Observable<ReqForm[]>
    {
        console.log("==> Enter service  get requests");
        return this.axiosService.get<ReqForm[]>('/requests')
        .pipe(
            map((data: ReqForm[]) => {
                console.log(data);
                console.log("map  data get requests");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to get requests');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                return EMPTY;           
            })
        )
    }

    getcontacts(obj: ReqForm):Observable<Contact>
    {
        console.log("===========" + obj);
        console.log("==> Enter service  get requests");
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        console.log("========255");
        for (const pair of formData.entries()) {
            const [key, value] = pair;
            console.log(`Parameter: ${key}, Value: ${value}`);
        }
        return this.axiosService.post<Contact>('/contacts', formData.toString())
        .pipe(
            map((data: Contact) => {
                console.log(data);
                console.log("map  data get requests");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to get requests');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                return EMPTY;           
            })
        )
    }
    deleteDocument(obj: DocForm): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataDoc(formData, obj);
        console.log("before view formatda");
        const entriesArray = Array.from(formData.entries());
        console.log(entriesArray);
        console.log("after view formdata");
        return this.axiosService.delete<apiResponse>('/documents', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                console.log("map  data get requests");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to  delet  document');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                //return EMPTY;   
                const data:apiResponse = {error: "Document Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    updateDocument(obj:DocForm , id_doc: string): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataDoc(formData, obj);
        //formData.append('doc_description', description);
        console.log("before view formatda");
        const entriesArray = Array.from(formData.entries());
        console.log(entriesArray);
        console.log("after view formdata");

        return this.axiosService.update<apiResponse>('/documents/'+id_doc, formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                console.log("map  data get requests");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to  update  document');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                //return EMPTY;   
                const data:apiResponse = {error: "Document Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    deleteRequest(obj: ReqForm): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        console.log("before view formatda");
        const entriesArray = Array.from(formData.entries());
        console.log(entriesArray);
        console.log("after view formdata");
        return this.axiosService.delete<apiResponse>('/requests', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                console.log("map Response delete Request");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to  delet  Request');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                //return EMPTY;   
                const data:apiResponse = {error: "Request Not Found! ", message: ""}
                return of(data);         
            })
        )
    }

    updateRequest(obj:ReqForm , id_req: number): Observable<apiResponse>{
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        //formData.append('doc_description', description);
        console.log("before view formatda");
        const entriesArray = Array.from(formData.entries());
        console.log(entriesArray);
        console.log("after view formdata");

        return this.axiosService.update<apiResponse>('/requests/'+id_req, formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                console.log("map  data update Request");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to  update  Request');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
                //return EMPTY;   
                const data:apiResponse = {error: "Request Not Found! ", message: ""}
                return of(data);         
            })
        )
    }
    getDocInfo(obj: ReqForm):Observable<apiResponse>
    {
        const formData = new URLSearchParams();
        this.fillDataReq(formData, obj);
        for (const pair of formData.entries()) {
            const [key, value] = pair;
            console.log(`Parameter: ${key}, Value: ${value}`);
        }
        return this.axiosService.post<apiResponse>('/documents/description', formData.toString())
        .pipe(
            map((data: apiResponse) => {
                console.log(data);
                console.log("map  data get Doc info");
                this.isSavingSig.set(false);
                return data;
            }),
            catchError(error => {
                console.error(error);
                console.log('An error occurred while trying to get doc info');
                this.isSavingSig.set(false);
                //return EMPTY; // Return an empty observable to complete immediately
                //const data:apiResponse = {error: "An error occurred while trying to create document", message: ""}
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

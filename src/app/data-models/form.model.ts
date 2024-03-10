import internal from "stream";

export interface RegisterForm {
    username: string;
    password: string;
    email: string;
    phone: number;  /*key must be string*/ /*value type is number*/
    counttry: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface DocForm {
    doc_id: string;
    doc_type: string;
    doc_description: string;
}

export interface ReqForm {
    id: number;
    doc_id: string;
    doc_type: string;
    req_type: string;
    req_description: string;
    req_status: string;
}
export interface apiResponse{
    message: string;
    error:string;
}
export interface Contact{
    description: string;
    phone: number;
    email: string;
}

export interface ApiToken{
    access_token: string;
    username: string;

}


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
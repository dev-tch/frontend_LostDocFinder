import { Component,Signal, computed} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators , FormBuilder, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../http-services/user.service';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegisterForm } from '../../data-models/form.model';
import { apiResponse } from '../../data-models/form.model';
import {OnInit} from '@angular/core';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  providers:  []
})

export class RegisterPageComponent implements OnInit {
    /*fields of class*/
    serverResponse:apiResponse = {message: '', error: ''} ; //map the response backend api

    isSavingSigComp: Signal<boolean> ;

    form: FormGroup = new FormGroup
    (
        {
        username: new FormControl(''),
        password: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        county: new FormControl('')
        }
    );
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router) 
    {
        this.isSavingSigComp = computed(() =>  userService.isSavingSig()    &&  true);
    }
    ngOnInit(): void {
        this.form = this.formBuilder.group(
            {
                username: 
                [
                    '',
                    [
                      Validators.required,
                      Validators.minLength(6),
                      Validators.maxLength(30)
                    ]
                ],
                password: 
                [
                    '',
                    [
                      Validators.required,
                      Validators.minLength(8),
                      Validators.maxLength(128)
                    ]
                ],
                email:
                [
                    '',
                    [Validators.required, 
                    Validators.email
                    ]
                ],
                phone:
                [
                    '',
                    [Validators.required, 
                    Validators.pattern('[- +()0-9]{8,12}')
                    ]
                ],
                country:
                [
                    '',
                    [Validators.required
                    ]
                ]
              
            }
        )
    }
    get f(): { [key: string]: AbstractControl } 
    {   

        return this.form.controls;
    } 
    onSubmit(): void 
    {
        //empty object serverResponse on each click of button submit
        this.serverResponse = {message: '', error: ''}
        //don't call the backend api if form is not valid
        if (this.form.invalid ) {
            return;
        }
        //set the signal isSavingSig to true to display 'loading content' instead of button submit
        this.userService.isSavingSig.set(true);

        // call  api/users to create new user in database
        this.userService.postRegister(<RegisterForm>this.form.getRawValue())
        .subscribe
        ({
            next : data => {
                if (data && data.error )
                {
                    this.serverResponse.error = data.error;
                }
                if (data && data.message)
                {
                    this.serverResponse.message = data.message;
                    setTimeout(() => {
                        // Show message 
                        console.log(this.serverResponse.message);
                        // Navigate to another route after timeout
                        this.router.navigate(['/login']); 
                      }, 3000);
                }         
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service signup")
            }
        });
    } 
    onReset(): void 
    {
        this.form.reset();
    }  
}

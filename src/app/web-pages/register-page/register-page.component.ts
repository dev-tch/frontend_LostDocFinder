import { Component,Signal, computed} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators , FormBuilder, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../http-services/user.service';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegisterForm } from '../../data-models/form.model';
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
    isRegisteredComp :Signal<boolean> ;
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
        private router: Router
      ) {
        this.isRegisteredComp = computed(() => userService.isRegistredSig() &&  true);
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
        if (this.form.invalid ) {
            return;
        }
        this.userService.isSavingSig.set(true);
        this.userService.postRegister(<RegisterForm>this.form.getRawValue());
        this.isSavingSigComp = computed(() => {
            console.log('Status Registered is: ' + this.userService.isRegistredSig());
            if (this.userService.isRegistredSig() == true && !this.userService.isLoginSig()) {
               this.router.navigate(['/login']);  
               return true;    
            }else
                return false;
        });
    } 
    onReset(): void 
    {
        this.form.reset();
    }  
}

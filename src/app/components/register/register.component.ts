import { Component} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators , FormBuilder, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RouterOutlet } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {OnInit} from '@angular/core';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers:  []
})

export class RegisterComponent implements OnInit {
    /*define fields*/
    isLogin:boolean  = false;
    isSaving:boolean = false;
    isRegistred: boolean = false;
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
      ) {}
    ngOnInit(): void {
        this.userService.getIsRegistred().subscribe(isRegistred => {
            this.isRegistred = isRegistred;
            if(this.isRegistred == true)
            {
                this.router.navigate(['/login']);
                this.isRegistred = false;
                this.userService.setIsRegistred(false);
                
            }
    	});
        this.userService.getIsSaving().subscribe(isSaving => {
            this.isSaving= isSaving;
    	});
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
        this.isSaving = true;
        this.userService.setIsSaving(true);
        this.userService.postRegister(this.form.getRawValue());
    } 
    onReset(): void 
    {
        this.form.reset();
    }  
}

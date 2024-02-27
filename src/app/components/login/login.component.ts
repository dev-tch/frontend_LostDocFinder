import { Component , OnInit } from '@angular/core';
import { FormGroup,FormsModule,Validators,FormBuilder,ReactiveFormsModule} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
    loginForm!: FormGroup;
    isLogin:boolean  = false;
    isSaving:boolean  = false;
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router
      ) {}
    ngOnInit(): void {
        this.userService.getIsLogin().subscribe(isLogin => {
          //this.isSaving = value; // Update the boolean value in the component
          this.isLogin = isLogin
          if (this.isLogin == true){
            this.router.navigate(['/dashboard']);
        }
        });
        this.userService.getIsSaving().subscribe(isSaving => {
            //this.isSaving = value; // Update the boolean value in the component
            this.isSaving = isSaving
          });
        this.buildForm();
    }
    buildForm(): void {
        this.loginForm = this.formBuilder.group({
          username: [
            '',
            [
              Validators.required,
            ],
          ],
          password: ['', Validators.required],
        });
      }
      onSubmit(): void 
      { 
        this.isSaving = true;
        this.userService.setIsSaving(true);
        this.userService.postLogin(this.loginForm.getRawValue());
      }  
}

import { Component , OnInit ,Signal ,computed } from '@angular/core';
import { FormGroup,FormsModule,Validators,FormBuilder,ReactiveFormsModule} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../http-services/user.service';
import { LocalService } from '../../storage-services/local.service';
import { Router } from '@angular/router';
import { LoginForm } from '../../data-models/form.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
    serverError: string | null = null;
    loginForm!: FormGroup;
    isLogingSigComp :Signal<boolean> ;
    isSavingSigComp: Signal<boolean> ;
    usernameSigComp: Signal<string> ;
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private local_s : LocalService,
        private router: Router,
      ) {

       this.isLogingSigComp = computed(() => userService.isLoginSig() && true );
       this.isSavingSigComp = computed(() => userService.isSavingSig() && true );
       this.usernameSigComp = computed(() => userService.usernameSig() );
      }
    ngOnInit(): void {
        console.log("Enter init login");
        if (this.isLogingSigComp() == true )
        {
            this.router.navigate(['/dashboard']);
        }
        else
        {
            this.buildForm();
        }
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
      { this.serverError = null;
        this.userService.isSavingSig.set(true);
        this.userService.postLogin(<LoginForm>this.loginForm.getRawValue());
        this.isLogingSigComp = computed(() => {
            console.log('<LoginPageComponent>:Status Login is: ' +  this.userService.isLoginSig());
            if (this.userService.isLoginSig() == true ) 
            {
                this.local_s.saveUserName('username', this.usernameSigComp());
                this.local_s.save('user', true , 1200 );
                this.router.navigate(['/dashboard']);
               return true;
            } else {
                this.serverError = "invalid credentials!!";
                return false;
            }
          });
      } 
}

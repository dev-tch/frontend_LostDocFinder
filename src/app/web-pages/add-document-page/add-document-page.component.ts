import { Component , OnInit,Signal,computed} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../../http-services/user.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { apiResponse } from '../../data-models/form.model';
@Component({
  selector: 'app-document-page',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule,MatSelectModule, MatButtonModule, RouterOutlet],
  templateUrl: './add-document-page.component.html',
  styleUrl: './add-document-page.component.css'
})
export class addDocumentPageComponent implements OnInit {
    isLogingSigComp :Signal<boolean> ;
    isSavingSigComp: Signal<boolean> ;
    form!: FormGroup;
    serverError: string | null = null;
    serverMsg: string | null = null;
    constructor(private userService: UserService, private fb: FormBuilder,   private router: Router,)
    {
        this.isLogingSigComp = computed(() => userService.isLoginSig() && true );
        this.isSavingSigComp = computed(() => userService.isSavingSig() && true );
    
    }
    doc_type = new FormControl('', Validators.required);
    
   
    ngOnInit(): void {
        if (this.isLogingSigComp() == true)
        {
            console.log("loaded form documen creation");
        }
        else 
        {
            this.router.navigate(['/home']);
        }
        this.form = this.fb.group({
            doc_id: ['', Validators.required],
            doc_type: ['', Validators.required],
            doc_description: ['']
          });
        }
    onSubmit(): void 
    {  
        if (this.form.invalid ) 
        {
            return;
        }
       this.serverError = null;
       this.serverMsg =  null;

       console.log(this.form.value); 
       let res:apiResponse;
       this.userService.isSavingSig.set(true);
       this.userService.createDocument(this.form.value)
       .subscribe
       ({
            next : data => {
                if (this.isSavingSigComp() == false)
                {
                    if (data.error)
                    {
                        this.serverError =  data.error;
                    }
                    else if (data.message)
                    {
                        this.serverMsg =  data.message;
                    }
                    else {
                        this.serverError = "an error ocuured in server while creating document!!"
                    }
                }
            },
            error: err  => 
            {
                this.serverError = "an error ocuured in server while creating document!!";
            },
            complete: () => 
            {
                console.log("complete service add document")
            }
        });
    } 
}

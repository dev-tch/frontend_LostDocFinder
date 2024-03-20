import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UserService } from '../../http-services/user.service';
import { DocForm, apiResponse } from '../../data-models/form.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, MatCardModule,MatDividerModule,MatFormFieldModule,FormsModule,ReactiveFormsModule],
  templateUrl: './view-document-page.component.html',
  styleUrl: './view-document-page.component.css'
})

export class ViewDocumentPageComponent implements AfterViewInit , OnInit{
  displayedColumns: string[] = ['doc_id', 'doc_type' /*, 'doc_description'*/ , 'Delete', 'Info'];
  documents: DocForm[] = [];
  dataSource = new MatTableDataSource<DocForm>();
  serverResponse:apiResponse = {message: '', error: ''} ;
  showinfo: boolean = false ;
  updatedoc: boolean = false;
  description: string = "";
  id_doc: string = "";
  elementdata!: DocForm;
  form!: FormGroup;
  doc_description = new FormControl('', Validators.required);
  constructor(private userService: UserService, private fb: FormBuilder){
   
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
        this.userService.getDocuments().subscribe
        ({
            next : data => {
                this.documents =  data;
                console.log(this.documents);
                this.dataSource.data = this.documents;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service getDocuments")
            }
        });
        this.form = this.fb.group({
            doc_description: ['', Validators.required]
        });
    }

    deleteDocument(element: DocForm) {
         //empty object serverResponse and clean variables
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showinfo  = true;
        this.updatedoc = false;

        //call backend api to delete document
        this.userService.deleteDocument(element)
        .subscribe
        ({
                next : data => {    
                console.log(data);
                if (data && data.error )
                {
                    this.serverResponse.error = data.error;
                }
                if (data && data.message)
                {
                    this.serverResponse.message = data.message;
                }
                
                },
                error: err  => 
                {
                console.log(err);
                },
                complete: () => 
                {
                    console.log("complete service deleteDocument");
                }
            });
        console.log(element.doc_type);
    }
    updateDocdescription(element: DocForm) {
        //empty object serverResponse
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showinfo  = true;
        this.updatedoc = true;

        this.description = element.doc_description
        this.id_doc      = element.doc_id
        this.elementdata = element;
    }

    hideServerInfo()
    {
        //this method called when click back button
        //clean all variables
        
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.updatedoc              = false
        this.showinfo               = false;

        //call again service api/Documents to refresh the page
        this.userService.getDocuments().subscribe
        ({
            next : data => {
                this.documents =  data;
                console.log(this.documents);
                this.dataSource.data = this.documents;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service getDocuments")
            }
        });
        this.form = this.fb.group({
            doc_description: ['', Validators.required]
        });
    }
    onSubmitUpdateDoc()
    {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showinfo  = true;
        this.updatedoc = false;

        //call backend api to update document description
        this.userService.updateDocument(this.form.value, this.id_doc )
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
                }
                
                },
                error: err  => 
                {
                console.log(err);
                },
                complete: () => 
                {
                    console.log("complete service updateDocument");
                }
            });

    }
}


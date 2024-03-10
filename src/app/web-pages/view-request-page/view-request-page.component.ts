import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UserService } from '../../http-services/user.service';
import { DocForm, ReqForm } from '../../data-models/form.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Contact } from '../../data-models/form.model';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { apiResponse } from '../../data-models/form.model';
import { FormGroup } from '@angular/forms';
import { FormBuilder , Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule,MatCardModule,MatDividerModule,FormsModule,ReactiveFormsModule],
  templateUrl: './view-request-page.component.html',
  styleUrl: './view-request-page.component.css'
})

export class ViewRequestPageComponent implements AfterViewInit , OnInit{
  displayedColumns: string[] = ['id', 'doc_id', 'doc_type', 'req_type','req_status', 'contact', 'Delete', 'Info', 'doc'];
  serverResponse:apiResponse = {message: '', error: ''} ;
  requests: ReqForm[] = [];
  dataSource = new MatTableDataSource<ReqForm>();
  showInfo:boolean  = false;
  public contact!:Contact;
  updatereq = false;
  description: string = "";
  doc_info: string = "";
  id_req: number = 0;
  form!: FormGroup;
  constructor(private userService: UserService, private fb: FormBuilder){
   
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
        this.userService.getRequests().subscribe
        ({
            next : data => {
                console.log("visua data requests");
                this.requests =  data;
                console.log(this.requests);
                this.dataSource.data = this.requests;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service view requests")
            }
        });
        this.form = this.fb.group({
            req_description: ['', Validators.required]
        });
    }

    viewContact(element: ReqForm) {
        // Here you can access the data of the clicked row (element) and make necessary service call
        
      this.userService.getcontacts(element)
        .subscribe
        ({
             next : data => {
                console.log(data);
                this.contact = data; 
                this.showInfo = true;          
             },
             error: err  => 
             {
             },
             complete: () => 
             {
                 console.log("complete service add Request")
             }
         });
        console.log(element.doc_type);
    }
    hideInfo()
    {
        this.showInfo = false ;
        this.userService.getRequests().subscribe
        ({
            next : data => {
                console.log("visua data requests");
                this.requests =  data;
                console.log(this.requests);
                this.dataSource.data = this.requests;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service view requests")
            }
        });
        this.form = this.fb.group({
            req_description: ['', Validators.required]
        });
    }

    deleteRequest(element: ReqForm) {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = false;
        this.userService.deleteRequest(element)
        .subscribe
        ({
                next : data => {    
                console.log("data");
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
                    console.log("complete service delete service document");
                }
            });
    }
    updateReqdescription(element: ReqForm) {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = true;
        this.description = element.req_description
        this.id_req = element.id;

    }
    onSubmitUpdateReq()
    {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = false;
        this.userService.updateRequest(this.form.value, this.id_req )
        .subscribe
        ({
                next : data => {    
                console.log("data");
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
                    console.log("complete service update document request");
                }
            });
    }
    viewDocInfo(element: ReqForm) {
        // Here you can access the data of the clicked row (element) and make necessary service call
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = false ;
        this.userService.getDocInfo(element)
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
                },
                complete: () => 
                {
                    console.log("complete service add Request")
                }
            });
    }
}


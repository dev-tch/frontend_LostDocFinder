import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UserService } from '../../http-services/user.service';
import {ReqForm} from '../../data-models/form.model';
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
  public contact:Contact | null = null;;
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
                this.requests =  data;
                this.dataSource.data = this.requests;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service getRequests")
            }
        });
        this.form = this.fb.group({
            req_description: ['', Validators.required]
        });
    }

    viewContact(element: ReqForm) {
        // Here you can access the data of the clicked row (element) and make necessary service call
        /*clean variables */
        this.showInfo               = true ;
        this.updatereq              = false;
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.contact= null;
        // call backend api to get the contact of other user 
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
                    console.log("complete service getcontacts")
                    if (!this.contact)
                    {
                        this.serverResponse.error = "contact not found!!";
                    }
                }
            });
        console.log(element.doc_type);
    }
    hideInfo()
    {
        //this method called when click back button
        //clean variables
        this.showInfo               = false ;
        this.updatereq              = false;
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.contact                = null;
        //call again service api/requests to refresh the page
        this.userService.getRequests().subscribe
        ({
            next : data => {
                this.requests =  data;
                this.dataSource.data = this.requests;
            },
            error: err  => 
            {
            },
            complete: () => 
            {
                console.log("complete service getRequests")
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
        this.contact   = null;
        // call backend api delete Document Request
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
                    console.log("complete service deleteRequest");
                }
            });
    }
    updateReqdescription(element: ReqForm) {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = true;
        this.contact   = null;
        this.description = element.req_description
        this.id_req = element.id;

    }
    onSubmitUpdateReq()
    {
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = false;
        this.contact   = null;
        // call backend api to update document Request description
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
                    console.log("complete service updateRequest");
                }
            });
    }
    viewDocInfo(element: ReqForm) {
        // Here you can access the data of the clicked row (element) and make necessary service call
        this.serverResponse.error   = "";
        this.serverResponse.message = "";
        this.showInfo  = true;
        this.updatereq = false ;
        this.contact   = null;
         // call backend api to get the description of document 
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
                    console.log("complete service getDocInfo")
                }
            });
    }
}


import { Component , OnInit, Signal, computed, afterRender, Input, OnChanges, SimpleChanges} from '@angular/core';
import { UserService } from '../../http-services/user.service';
import { Router } from '@angular/router';
import { LocalService } from '../../storage-services/local.service';
@Component({
  selector: 'app-logout-page',
  standalone: true,
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.css'
})
export class LogoutPageComponent implements OnInit{
    isLogingSigComp :Signal<boolean> ;
    constructor(
        private userService: UserService,
        private router: Router,
        private local_s : LocalService
       
        
    ) { 
        this.isLogingSigComp = computed(() => this.userService.isLoginSig() && true /*|| this.data_log*/);
    }
    
ngOnInit(): void 
    {
        console.log("enter logout init");
        if (this.isLogingSigComp() /*|| this.data_log*/)
        {
            console.log("call service postLogout");
            this.userService.postLogout();
            if (this.isLogingSigComp() == false )
            {
                console.log("there is some problem in service postLogout!!")
            }
            else{
                this.router.navigate(['/home']);
                this.local_s.clearLogin('user');
                this.local_s.removeUserName('username');
            }
        }
    }
    
}

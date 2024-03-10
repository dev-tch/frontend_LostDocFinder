import { Component, Signal, computed , OnInit} from '@angular/core';
import { UserService } from '../../http-services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit{
    isLogingSigComp :Signal<boolean> ;
    isSavingSigComp: Signal<boolean> ;
    constructor(private userService: UserService,private router: Router,)
    {
        this.isLogingSigComp = computed(() => userService.isLoginSig() && true );
        this.isSavingSigComp = computed(() => userService.isSavingSig() && true );
    }
    ngOnInit(): void {
        
        if (this.isLogingSigComp() == true )
        {
            console.log("==>loaded  dashbord component");
            
        }
        else
        {
            this.router.navigate(['/home']);
        }
    }
}

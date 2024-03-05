import { Component,OnInit, Signal, computed} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule}   from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { UserService } from './http-services/user.service';
import { LocalService } from './storage-services/local.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
        FormsModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        RouterModule,
        MatExpansionModule,
        MatTooltipModule,
        RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit
{
    public isLogingSigComp :Signal<boolean> ;
    //public data_log: boolean = false;

    constructor(private userService: UserService,
                /*private local_s : LocalService*/
                ) 
    {
        this.isLogingSigComp = computed(() => userService.isLoginSig() && true  /*this.data_log */);
       /* afterRender(
            ()=> 
            {
                this.data_log = this.local_s.load('user');
            }
        )   */             
    }
    ngOnInit(): void {
        this.isLogingSigComp = computed(() => {
            console.log('Status Login is ==> ' + (this.userService.isLoginSig()  && true /* this.data_log*/));
            if (this.userService.isLoginSig() /* ||  this.data_log */) {
               return true;
            } else {
                return false;
            }
        });
    }
}

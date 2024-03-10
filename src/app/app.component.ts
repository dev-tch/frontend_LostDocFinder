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
    public usernameSigComp :Signal<string> ;

    constructor(private userService: UserService) 
    {
        this.isLogingSigComp = computed(() => userService.isLoginSig() && true ); 
        this.usernameSigComp = computed(() => userService.usernameSig());             
    }
    ngOnInit(): void {
        this.isLogingSigComp = computed(() => {
            console.log('<AppComponent>:Status Login is ==> ' + (this.userService.isLoginSig()  && true));
            if (this.userService.isLoginSig() ) {
               return true;
            } else {
                return false;
            }
        });
    }
}

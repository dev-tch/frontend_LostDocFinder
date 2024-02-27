import { Component , OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {
    isLogin: boolean = false;
    token_session: string = "";
    constructor(
        private userService: UserService,
        private router: Router
    ) { }
    ngOnInit(): void {
        this.userService.postLogout();
        this.userService.getIsLogin().subscribe(isLogin => {
            this.isLogin = isLogin;
            if (this.isLogin == false)
            {
                this.router.navigate(['/home']);
            }
        });
      }

}

import { Component} from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorLogin: boolean = false;
  errorMessage: string = '';

  constructor (private router: Router){}

  async login() {
    /*try {
      this.errorLogin = false;
      const isUserLoggedIn = await this.authService.login(this.email, this.password).toPromise();
      if (isUserLoggedIn) {
        const userRole = localStorage.getItem('acessRole');
        const roleRouteMap: { [key: string]: string } = {
          'service': '/menu',
          'chefe': '/cozinha',
          'admin': '/admin'
        };

        if (userRole !== null && userRole in roleRouteMap) {
          const targetRoute = roleRouteMap[userRole];
          this.router.navigate([targetRoute]);
        } else {
          throw new Error('Invalid role');
        }
      } else {
        this.errorLogin = true;
        throw new Error('Invalid login');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorLogin = true;
    }*/
  }
}





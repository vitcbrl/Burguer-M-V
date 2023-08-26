import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication.service';
import { Observable } from 'rxjs';

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

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.errorLogin = false;

    const loginObservable: Observable<boolean> = this.authService.login(this.email, this.password);
     
    loginObservable.subscribe({
      next: isUserLoggedIn => {
        if (isUserLoggedIn) {
          const userRole = localStorage.getItem('accessRole');
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
          this.errorMessage = 'Invalid login';
        }
      },
      error: error => {
        console.error('Login error:', error);
        this.errorLogin = true;
        this.errorMessage = 'Email ou senha inválidos';
      }
    });
  }
}

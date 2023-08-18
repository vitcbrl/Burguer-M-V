import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../services/authentication.service';

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

  constructor(private authService: AuthService , private router: Router) {}
  login(){
    this.authService.login(this.email, this.password).subscribe(
      result => {
        if(result){
          this.router.navigate(["aqui fica a rota do meu componente de menu"])
        }else{
          this.errorLogin = true;
          this.errorMessage = 'Credencias invalidas';
          console.log(this.errorMessage)
        }
      },
      error => {
        this.errorLogin = true;
        this.errorMessage = 'Ocorreu um erro durante o login';
        console.log(this.errorMessage)
      }
    )
  }
}





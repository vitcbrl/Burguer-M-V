import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    const loginUser = { email, password };

    return this.http.post<any>('http://localhost:8080/login', loginUser).pipe(
      map(response => {
        if (response.acessToken) {
          localStorage.setItem('acessToken', response.acessToken);
          localStorage.setItem('acessRole', response.user.role);
          localStorage.setItem('acessName', response.user.name);
          localStorage.setItem('acessEmail', response.user.email);
          return true;
        } else {
          throw new Error("Inválidos");
        }
      }),
      catchError(error => {
        console.log('Erro no login', error);
        throw new Error("Ocorreu um erro durante o login. Por favor, tente novamente");
      })
    );
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  UserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  TokenStorage(token: string) {
    localStorage.setItem('token', token);
  }

  Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.router.navigate(['']);
  }

  Username(): string | null {
    return localStorage.getItem('username');
  }
}

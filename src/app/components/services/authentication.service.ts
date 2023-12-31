import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/login';
  private accessTokenKey = 'accessToken';
  private userRoleKey = 'accessRole';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    const loginUser = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, loginUser).pipe(
      map(response => {
        if (response.accessToken) {
          localStorage.setItem(this.accessTokenKey, response.accessToken);
          localStorage.setItem(this.userRoleKey, response.user.role);
          return true;
        } else {
          throw new Error("Credenciais inválidas");
        }
      }),
      catchError(error => {
        console.log('Erro de login', error);
        return throwError("Ocorreu um erro durante o login. Por favor, tente novamente.");
      })
    );
  }

  isUserLoggedIn(): { loggedIn: boolean, token: string | null } {
    const token = localStorage.getItem(this.accessTokenKey);
    return {
      loggedIn: !!token,
      token: token
    };
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  // Obter o email do usuario logado
  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  // Armazenar o token no localStorage após o login
  storageToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Remover o token após logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.router.navigate(['']);
  }

  getUsername(): string | null {
    return localStorage.getItem('username')
  }
}
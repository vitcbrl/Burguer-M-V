/*import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:8080'; // Use HTTPS instead of HTTP
  private accessTokenKey = 'accessToken'; // Use a consistent key for token storage
  private userRoleKey = 'userRole';
  private userNameKey = 'userName';
  private userEmailKey = 'userEmail';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    const loginUser = { email, password };

    return this.http.post<any>(`${this.apiUrl}/login`, loginUser).pipe(
      map(response => {
        if (response.accessToken) { // Use camelCase for consistency
          localStorage.setItem(this.accessTokenKey, response.accessToken);
          localStorage.setItem(this.userRoleKey, response.user.role);
          localStorage.setItem(this.userNameKey, response.user.name);
          localStorage.setItem(this.userEmailKey, response.user.email);
          return true;
        } else {
          throw new Error("Invalid credentials");
        }
      }),
      catchError(error => {
        console.log('Login error', error);
        throw new Error("An error occurred during login. Please try again.");
      })
    );
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessTokenKey); // Use double negation to convert to boolean
  }

  getUserEmail(): string | null { // Use camelCase for consistency
    return localStorage.getItem(this.userEmailKey);
  }

  storeToken(token: string) { // Use camelCase for consistency
    localStorage.setItem(this.accessTokenKey, token);
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.userEmailKey);
    this.router.navigate(['']);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }
}*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authentication.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';
  constructor(private http: HttpClient, private authService: AuthService) { }

  getEmployees(): Observable<any[]> {
    const { loggedIn, token } = this.authService.isUserLoggedIn();

    if (!loggedIn) {
      throw new Error('Usuário não logado');
    }

    // Define os headers com o cabeçalho de autorização
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Passa os headers para a solicitação
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(users => {
        return users.filter(user => user.role === 'chefe' || user.role === 'service')
          .map(user => {
            return {
              name: user.name,
              role: user.role === 'chefe' ? 'Cozinheiro' : 'Garçom'
            };
          });
      })
    );
  }

  addEmployee(employee: any): Observable<any> {
    const { loggedIn, token } = this.authService.isUserLoggedIn();

    if (!loggedIn) {
      throw new Error('Usuário não logado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    if (employee.role === 'cozinheiro') {
      employee.role = 'chefe';
    } else if (employee.role === 'garçom') {
      employee.role = 'service';
    }

    const body = JSON.stringify({
      id: employee.id, 
      name: employee.name,
      email: employee.email,
      password: employee.password,
      role: employee.role
    });

    return this.http.post(this.apiUrl, body, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authentication.service';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';
  constructor(private http: HttpClient, private authService: AuthService) { }

  //puxando meus usuarios
  getEmployees(): Observable<any[]> {
    const { loggedIn, token } = this.authService.isUserLoggedIn();
  
    if (!loggedIn) {
      throw new Error('Usuário não logado');
    }
  
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    
    return this.http.get<any[]>(this.apiUrl, { headers });
    
    // Ao comentar essa linha de código, funcionou normalmente as atualizações de cadastro.
    /*.pipe(
      map(users => {
        return users.filter(user => user.role === 'chefe' || user.role === 'service')
          .map(user => {
            return {
              id: user.id, //me deu muito trabalha mas descobri que tinha que passar o id para o delete funcionar
              name: user.name,
              role: user.role === 'chefe' ? 'Cozinheiro' : 'Garçom' 
            };
          });
      })
    );*/
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
  
    if (employee.role === 'Cozinheiro') {
      employee.role = 'chefe';
    } else if (employee.role === 'Garçom') {
      employee.role = 'service';
    }
  
    const body = JSON.stringify({
      name: employee.name,
      email: employee.email,
      password: employee.password,
      role: employee.role
    });
  
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao adicionar funcionário:', error);
        throw error;
      })
    );
  }
  
  
  deleteEmployee(employeeId: number): Observable<any> {
    const { loggedIn, token } = this.authService.isUserLoggedIn();

    if (!loggedIn) {
      throw new Error('Usuário não logado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.apiUrl}/${employeeId}`;

    return this.http.delete(url, { headers });
  }

  updateEmployee(employeeId: number, updatedData: any): Observable<any> {
    const { loggedIn, token } = this.authService.isUserLoggedIn();
  
    if (!loggedIn) {
      throw new Error('Usuário não logado');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const url = `${this.apiUrl}/${employeeId}`;
  
    return this.http.patch(url, JSON.stringify(updatedData), { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
      })
    );
  }
}

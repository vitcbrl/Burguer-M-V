import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProducts(): Observable<any[]> {
    const { loggedIn, token} = this.authService.isUserLoggedIn();

    if(!loggedIn){
      throw new Error('Usuário não logado');
    }

    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache' // Evita o uso do cache
    });

    // Passa os headers para a solicitação
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhcmNvbmVudGVAYnVyZ3Vlck1WLmNvbSIsImlhdCI6MTY5MjY1Mzg5MSwiZXhwIjoxNjkyNjU3NDkxLCJzdWIiOiIxIn0.djkreDnVKAUi3mIuqhLJtmM3a_mBksa5cpUmewogS1o'; //conserta pegando meu token salvo

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    // Define os headers com o cabeçalho de autorização
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // Passa os headers para a solicitação
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}



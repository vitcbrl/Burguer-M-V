import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './authentication.service';
import { Observable, EMPTY } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders';
  private addedProducts: any[] = [];
  private addedProductSubject = new BehaviorSubject<any[]>(this.addedProducts);
  addedProduct$ = this.addedProductSubject.asObservable();

  public getApiUrl(): string {
    return this.apiUrl;
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addProduct(product: any) {
    const existingProduct = this.addedProducts.find(p => p.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      this.addedProducts.push({ product, quantity: 1 });
    }
    this.addedProductSubject.next(this.addedProducts);
  }

  removeProduct(productId: number) {
    this.addedProducts = this.addedProducts.filter(p => p.product.id !== productId);
    this.addedProductSubject.next(this.addedProducts);
  }

  getAddedProductsLength(): number {
    return this.addedProducts.length;
  }
  
  sendOrderToBackend(order: any) {
    const { loggedIn, token } = this.authService.isUserLoggedIn();

    if (!loggedIn) {
      throw new Error('User not logged in');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post(this.apiUrl, order, { headers }).subscribe(
      (response) => {
        console.log(response + ' enviado para a API');
        this.addedProducts = [];
        this.addedProductSubject.next(this.addedProducts);
      },
      (error) => {
        console.error('Falha ao enviar pedido para a API:', error.message);
      }
    );

    // Reset quantity inputs to zero
    this.addedProducts.forEach(item => {
      item.product.quantity = '';
    });
  }

   
  getOrders(): Observable<any[]> {
    const user = this.authService.isUserLoggedIn();
    const headers = new HttpHeaders({
      'Authorization': user.loggedIn ? `Bearer ${user.token}` : ''
    });

      return this.http.get<any[]>(this.apiUrl, { headers });
  }

  decreaseProductQuantity(productId: number) {
    const existingProduct = this.addedProducts.find(p => p.product.id === productId);
    if (existingProduct) {
      existingProduct.quantity -= 1;
    }
  }
  
  getOrderedProduct(productId: number): any {
    return this.addedProducts.find(p => p.product.id === productId);
  }
  
  updateOrder(order: any): Observable<any> {
    const updateUrl = `${this.apiUrl}/${order.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.isUserLoggedIn().token}`
    });

    return this.http.put(updateUrl, order, { headers });
  }

  //função para pegar os pedidos que estão marcados com ready no cooked
  getReadyOrdersFromBackend(): Observable<any[]> {
    const user = this.authService.isUserLoggedIn();
    if (user.loggedIn) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${user.token}`
      });

      //aqui tem uma verificação apara eu filtrar isso 
      return this.http.get<any[]>(`${this.apiUrl}?status=ready`, { headers });
    } else {
      return EMPTY;
    }
  }
}



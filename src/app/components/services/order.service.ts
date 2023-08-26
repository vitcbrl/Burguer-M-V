import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
        console.log(response + ' sent to the API');
        this.addedProducts = [];
        this.addedProductSubject.next(this.addedProducts);
      },
      (error) => {
        console.error('Failed to send order to the API:', error.message);
      }
    );

    // Reset quantity inputs to zero
    this.addedProducts.forEach(item => {
      item.product.quantity = '';
    });
  }

   
  getOrders(): Observable<any[]> {
    const user = this.authService.isUserLoggedIn();
    if (user.loggedIn) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${user.token}`
      });

      return this.http.get<any[]>(this.apiUrl, { headers });
    } else {
      // Handle not logged in scenario
      return EMPTY;  // or return an Observable with appropriate default data
    }
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
}

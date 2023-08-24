import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders'; // Update with the actual API URL
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
    const existingProduct = this.addedProducts.find(p => p.product.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.addedProducts = this.addedProducts.filter(p => p.product.id !== productId);
      }
      this.addedProductSubject.next(this.addedProducts);
    }
  }

  sendOrderToBackend(order: any) {
    const { loggedIn, token } = this.authService.isUserLoggedIn();

    if (!loggedIn) {
      throw new Error('User not logged in');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // mandando order pro backend
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
  }
}

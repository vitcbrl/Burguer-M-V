import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private addedProducts: any[] = [];
  private addedProductSubject = new BehaviorSubject<any[]>(this.addedProducts);
  addedProduct$ = this.addedProductSubject.asObservable();

  constructor() {}

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
}

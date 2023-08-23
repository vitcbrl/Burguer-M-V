import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders: any[] = [];
  private addedProductSubject = new BehaviorSubject<any[]>([]);
  addedProduct$ = this.addedProductSubject.asObservable();

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get<any[]>('http://localhost:8080/orders');
  }

  addProductToOrder(orderId: number, product: any) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      const existingProduct = this.orders[orderIndex].products.find((p: any) => p.product.id === product.id);
      if (existingProduct) {
        existingProduct.qty++;
      } else {
        this.orders[orderIndex].products.push({ qty: 1, product });
      }
    }
    this.addedProductSubject.next(this.orders);
  }

  removeProductFromOrder(orderId: number, productId: number) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      const productIndex = this.orders[orderIndex].products.findIndex((p: any) => p.product.id === productId);
      if (productIndex !== -1) {
        const product = this.orders[orderIndex].products[productIndex];
        if (product.qty > 1) {
          product.qty--;
        } else {
          this.orders[orderIndex].products.splice(productIndex, 1);
        }
      }
    }
    this.addedProductSubject.next(this.orders);
  }

  getTotalAmount(orderId: number) {
    const order = this.orders.find(order => order.id === orderId);
    if (!order) {
      return 0;
    }
    return order.products.reduce(
      (total: number, product: any) => total + product.product.price * product.qty,
      0
    );
  }

  sendOrderToKitchen(orderId: number, customerName: string) {
    const order = this.orders.find(order => order.id === orderId);
    if (!order) {
      return;
    }

    const orderDetails = {
      client: customerName,
      products: order.products.map((product: any) => ({ qty: product.qty, product: product.product }))
    };

    this.http.post('http://localhost:8080/sendOrderToKitchen', orderDetails).subscribe(
      (response) => {
        console.log('Pedido enviado para a cozinha:', response);
      },
      (error) => {
        console.error('Erro ao enviar pedido para a cozinha:', error);
      }
    );
  }
}

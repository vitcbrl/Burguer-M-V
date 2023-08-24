import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  selectedProducts: any[] = [];
  totalAmount: number = 0;
  customerName: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.addedProduct$.subscribe((products) => {
      this.selectedProducts = products;
      this.calculateTotalAmount();
    });
  }

  removeProductFromOrder(product: any) {
    this.orderService.removeProduct(product.id);
    product.quantity = 0; //redefino o valor do meu input de entrada que tá no meu menu.html
  }

  calculateTotalAmount(): number {
    return this.selectedProducts.reduce((total, product) => total + product.product.price * product.quantity, 0);
  }

  sendOrderToAPI() {
    console.log('Sending order:', this.customerName, this.selectedProducts);
    const order = {
      client: this.customerName,
      products: this.selectedProducts.map(item => {
        return {
          name: item.product.name,
          quantity: item.quantity,
        };
      })
    };
  
    try {
      this.orderService.sendOrderToBackend(order);
      this.customerName = ''; 
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending order:', error.message);
      } else {
        console.error('An unknown error occurred while sending the order.');
      }
    }
  }
};
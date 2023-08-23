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
  }

  calculateTotalAmount(): number {
    return this.selectedProducts.reduce((total, product) => total + product.product.price * product.quantity, 0);
  }

  sendOrderToAPI() {
    // Implementar a lógica de enviar o pedido para a API
  }
}

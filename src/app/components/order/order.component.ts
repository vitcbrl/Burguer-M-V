import { Component, Input } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  @Input() selectedProducts: any[] = [];
  @Input() totalAmount: number = 0;
  customerName: string = '';

  constructor(private orderService: OrderService) {}

  removeProductFromOrder(product: any) {
    this.orderService.removeProductFromOrder(this.selectedProducts[0]?.id, product.id);
    this.updateOrderSummary();
  }

  addProductToOrder(product: any) {
    this.orderService.addProductToOrder(this.selectedProducts[0]?.id, product);
    this.updateOrderSummary();
  }

  updateOrderSummary() {
    this.orderService.addedProduct$.subscribe(products => {
      this.selectedProducts = products;
      this.totalAmount = this.orderService.getTotalAmount(this.selectedProducts[0]?.id);
    });
  }

  sendOrderToKitchen() {
    const orderId = this.selectedProducts[0]?.id;
    if (!orderId || this.customerName.trim() === '') {
      return;
    }

    this.orderService.sendOrderToKitchen(orderId, this.customerName);
    this.resetOrderSummary();
  }

  resetOrderSummary() {
    this.selectedProducts = [];
    this.totalAmount = 0;
    this.customerName = '';
  }
}

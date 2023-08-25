import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-cooked',
  templateUrl: './cooked.component.html',
  styleUrls: ['./cooked.component.css']
})
export class CookedComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Replace 'any' with appropriate types
loadOrders() {
  this.orderService.getOrders().subscribe(
    (orders: any[]) => {
      this.orders = orders;
      
    },
    (error: any) => {
      console.error('Failed to fetch orders:', error);
    }
  );
}

  markOrderAsReady(order: any) {
    // Marcar o pedido como pronto
    order.status = 'ready';
    order.dateProcessed = new Date().toISOString();

    // Atualizar o pedido no serviço
    this.orderService.updateOrder(order).subscribe(
      () => {
        console.log('Order marked as ready:', order);
      },
      (error) => {
        console.error('Failed to mark order as ready:', error);
      }
    );
  }

  calculatePreparationTime(order: any): string {
    // Calcular o tempo de preparação do pedido
    if (order.status === 'ready' && order.dateEntry && order.dateProcessed) {
      const entryTime = new Date(order.dateEntry).getTime();
      const processedTime = new Date(order.dateProcessed).getTime();
      const preparationTime = processedTime - entryTime;
      const minutes = Math.floor(preparationTime / 1000 / 60);
      return `${minutes} min`;
    } else {
      return '-';
    }
  }
}

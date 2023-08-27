import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cooked',
  templateUrl: './cooked.component.html',
  styleUrls: ['./cooked.component.css']
})
export class CookedComponent implements OnInit {
  orders: any[] = [];
  activeTab: string = 'pending'; 

  constructor(private orderService: OrderService, private authService: AuthService, private datePipe: DatePipe ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  logout() {
    this.authService.logout();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(
      (orders: any[]) => {
        this.orders = orders.map(order => {
          const productDetails = order.products.map((product: any) => {
            return {
              productName: product.name,
              quantity: product.quantity,
            }
          });
          return {
            ...order,
            productDetails: productDetails
          }
        });
      },
      (error: any) => {
        console.error('Erro ao puxar os produtos', error);
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
        console.log('Pedido marcado como pronto:', order);
        this.loadOrders(); // Reload orders to update the list
      },
      (error) => {
        console.error('Falha ao marcar o pedido como pronto:', error);
      }
    );
  }

  calculatePreparationTime(order: any): string {
    if (order.status === 'ready' && order.dateEntry && order.dateProcessed) {
      const entryTime = new Date(order.dateEntry).getTime();
      const processedTime = new Date(order.dateProcessed).getTime();
      const preparationTime = processedTime - entryTime;
      const minutes = Math.floor(preparationTime / 1000 / 60);

      const formattedEntryDate = this.datePipe.transform(order.dateEntry, 'dd/MM/yyyy HH:mm:ss');
      //const formattedProcessedDate = this.datePipe.transform(order.dateProcessed, 'dd/MM/yyyy HH:mm:ss');

      return `Data: ${formattedEntryDate} - ${minutes} min`;
      //`Entregue em: ${formattedProcessedDate},`
    } else {
      return '';
    }
  }

   setActiveTab(tab: string) { //controlar qual aba está ativa
    this.activeTab = tab;
  }

  filterOrdersByStatus(status: string): any[] { //para filtrar os pedidos com base no status
    return this.orders.filter(order => order.status === status);
  }
}

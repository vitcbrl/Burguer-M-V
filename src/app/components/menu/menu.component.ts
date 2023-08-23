import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProducts: any[] = [];
  totalAmount: number = 0;
  customerName: string = '';
  filteredType: string = 'Café da manhã';
  @Output() addToOrder: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeFromOrder: EventEmitter<any> = new EventEmitter<any>();

  constructor(private productService: ProductService, private orderService: OrderService) {} 

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data[0];
      this.filteredProducts = this.products.filter(product => product.type === 'Café da manha');
    });
  }

  filterProducts(type: string) {
    this.filteredProducts = this.products.filter((product) => product.type === type);
    this.filteredType = type;
  }

  calculateTotalAmount() {
    this.totalAmount = this.selectedProducts.reduce(
      (total, product) => total + product.price,
      0
    );
  }

  sendOrderToKitchen() {
    // Send the order and selectedProducts to a backend service
    // to store the order in the database
  }

  // Função para adicionar um produto ao pedido
  addProductToOrder(product: any) {
    this.addToOrder.emit(product);
  }

  // Função para remover um produto do pedido
  removeProductFromOrder(product: any) {
    this.removeFromOrder.emit(product);
  }
}

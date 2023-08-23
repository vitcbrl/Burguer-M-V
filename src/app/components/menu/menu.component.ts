import { Component, OnInit, EventEmitter, Output } from '@angular/core'; //teste
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

    // Função para adicionar um produto ao pedido
    addProductToOrder(product: any) {
      this.orderService.addProduct(product);
    }
  
    // Função para remover um produto do pedido
    removeProductFromOrder(product: any) {
      this.orderService.removeProduct(product.id);
    }
  }

import { Component, OnInit, EventEmitter, Output, } from '@angular/core'; //teste
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service'; 
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  filteredType: string = 'Café da manha';
  @Output() addToOrder: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeFromOrder: EventEmitter<any> = new EventEmitter<any>();

  constructor(private productService: ProductService, private orderService: OrderService, private authService: AuthService) {} 

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data[0];
      this.filteredProducts = this.products.filter(product => product.type === 'Café da manha');
    });
  }

  logout(): void{
    this.authService.logout();
  }

  filterProducts(type: string) {
    this.filteredProducts = this.products.filter((product) => product.type === type);
    this.filteredType = type;
  }

    // Função para adicionar um produto ao pedido
    addProductToOrder(product: any) {
      this.orderService.addProduct(product);
      product.quantity = (product.quantity || 0) + 1;
    }
  
    removeProductFromOrder(product: any) {
      this.orderService.removeProduct(product.id);
      if (product.quantity && product.quantity > 0) {
        product.quantity -= 1;
      } else {
        product.quantity = '';
      }
    }};

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/authentication.service';
import { Router } from '@angular/router';

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

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router // Injete o Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data[0];
      this.filteredProducts = this.products.filter(product => product.type === 'Café da manha');
    });
  }

  goToMesas() {
    // Redirecionar para o componente Mesas
    this.router.navigate(['/tables']);
  }

  logout(): void {
    this.authService.logout();
  }

  filterProducts(type: string) {
    this.filteredProducts = this.products.filter((product) => product.type === type);
    this.filteredType = type;
  }

  addProductToOrder(product: any) {
    this.orderService.addProduct(product);
    this.updateProductQuantity(product, 1);
  }

  removeProductFromOrder(product: any) {
    const existingProduct = this.orderService.getOrderedProduct(product.id);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        this.orderService.decreaseProductQuantity(product.id);
        this.updateProductQuantity(product, -1);
      } else {
        this.orderService.removeProduct(product.id);
        this.updateProductQuantity(product, -1);
      }
    }
  }

  private updateProductQuantity(product: any, change: number) {
    product.quantity = (product.quantity || 0) + change;
  }
}

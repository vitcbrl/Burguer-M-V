import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service'

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


  constructor(private productService: ProductService) {}

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
  
  addProductToOrder(product: any) {
    const selectedProduct = { ...product };
    this.selectedProducts.push(selectedProduct);
    this.calculateTotalAmount();
  }

  removeProductFromOrder(index: number) {
    this.selectedProducts.splice(index, 1);
    this.calculateTotalAmount();
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
}


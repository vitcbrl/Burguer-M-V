import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { ProductService } from '../services/product.service';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/authentication.service';
import { of,  Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

class MockProductService {
  getProducts() {
    return of([[{ id: 1, name: 'Produto 1', type: 'Café da manha' }]]);
  }
}

class MockOrderService { 
 addedProduct$ = new Subject<any[]>();
 products: any[] = [];

 addProduct(product: any){
  this.products.push(product);
  this.addedProduct$.next(this.products);
 }

 getOrderedProduct(productId: number){
  if(productId === 1){
    return {id: 1, quantity: 1};
  }
  return null;
 }

 decreaseProductQuantity() {}
 removeProduct() {}
}

class MockAuthService { 
  logout() {}
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockAuthService: MockAuthService;

  let mockOrderService: MockOrderService;
  let orderServiceAddProductSpy: jasmine.Spy;
  let orderServiceGetOrderedProductSpy: jasmine.Spy;
  let orderServiceDecreaseProductQuantitySpy: jasmine.Spy;
  let orderServiceRemoveProductSpy: jasmine.Spy;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    mockOrderService = new MockOrderService();
    

    TestBed.configureTestingModule({
      declarations: [MenuComponent, OrderComponent],
      imports: [FormsModule, RouterTestingModule], 
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: AuthService, useValue: mockAuthService },
      ]
    });
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    orderServiceAddProductSpy = spyOn(mockOrderService, 'addProduct').and.callThrough();
    orderServiceGetOrderedProductSpy = spyOn(mockOrderService, 'getOrderedProduct').and.returnValue({id: 1, quantity: 1});
    orderServiceDecreaseProductQuantitySpy = spyOn(mockOrderService, 'decreaseProductQuantity');
    orderServiceRemoveProductSpy = spyOn(mockOrderService, 'removeProduct');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - Deve buscar produtos durante a inicialização', () => {
    component.ngOnInit();

    expect(component.products.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].type).toEqual('Café da manha');
  });

  it('goToMesas - Deve redirecionar para o componente Mesas', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.goToMesas();

    expect(navigateSpy).toHaveBeenCalledWith(['/tables']);
  });

  it('logout - Deve chamar o método logout() do AuthService ao efetuar logout', () => {
    const authServiceLogoutSpy = spyOn(mockAuthService, 'logout');

    component.logout();

    expect(authServiceLogoutSpy).toHaveBeenCalled();
  });

  it('filterProducts - Deve filtrar produtos corretamente', () => {
    component.products = [
      {id: 1, name: 'Produto 1', type: 'Café da manhã'},
      {id: 2, name: 'Produto 2', type: 'Almoço'},
    ];

    component.filterProducts('Almoço');

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].type).toEqual('Almoço');
    expect(component.filteredType).toEqual('Almoço');
  });

  it('addProductToOrder - Deve adicionar produto ao pedido corretamente', () => {
    const product = {id: 1, name: 'Produto 1', type: 'Café da manhã', quantity: 0};

    component.addProductToOrder(product);

    expect(orderServiceAddProductSpy).toHaveBeenCalledWith(product);
    expect(product.quantity).toBe(1);

    mockOrderService.addedProduct$.next([product]);
  });

  it('removeProductFromOrder - Deve remover produto do pedido corretamente quando a quantidade é 1', () => {
    const product = { id: 1, name: 'Produto 1', type: 'Café da manhã', quantity: 1 };
    
    component.removeProductFromOrder(product);

    expect(orderServiceGetOrderedProductSpy).toHaveBeenCalledWith(product.id);
    expect(orderServiceDecreaseProductQuantitySpy).not.toHaveBeenCalled();
    expect(orderServiceRemoveProductSpy).toHaveBeenCalledWith(product.id);
    expect(product.quantity).toBe(0);
  })
});

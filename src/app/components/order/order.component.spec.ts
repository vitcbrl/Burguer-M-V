import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { OrderService } from '../services/order.service';
import { HttpClientModule } from '@angular/common/http';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderComponent],
      providers: [OrderService],
      imports: [HttpClientModule],
    })
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve inicializar selectedProducts e totalAmount', () => {
    expect(component.selectedProducts).toEqual([]);
    expect(component.totalAmount).toBe(0);
  });

  it('Deve remover produto do pedido corretamente', () => {
    const product = { id: 1, quantity: 5 };
    
    spyOn(orderService, 'removeProduct');

    component.removeProductFromOrder(product);

    expect(orderService.removeProduct).toHaveBeenCalledWith(product.id);
    expect(product.quantity).toBe(0);
  });

  it('Deve calcular o valor total corretamente', () => {
    const product1 = {product: {price: 10}, quantity: 3};
    const product2 = {product: {price: 5}, quantity: 2};

    component.selectedProducts = [product1, product2];

    const totalAmount = component.calculateTotalAmount();

    expect(totalAmount).toBe(10 * 3 + 5 * 2);
  });
});

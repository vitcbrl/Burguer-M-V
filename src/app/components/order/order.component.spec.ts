import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { OrderService } from '../services/order.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderComponent],
      providers: [OrderService],
      imports: [HttpClientModule, HttpClientTestingModule, FormsModule],
    })
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - Deve inicializar selectedProducts e totalAmount', () => {
    expect(component.selectedProducts).toEqual([]);
    expect(component.totalAmount).toBe(0);
  });

  it('removeProductFromOrder - Deve remover produto do pedido corretamente', () => {
    const product = { id: 1, quantity: 5 };

    spyOn(orderService, 'removeProduct');

    component.removeProductFromOrder(product);

    expect(orderService.removeProduct).toHaveBeenCalledWith(product.id);
    expect(product.quantity).toBe(0);
  });

  it('calculateTotalAmount - Deve calcular o valor total corretamente', () => {
    const product1 = { product: { price: 10 }, quantity: 3 };
    const product2 = { product: { price: 5 }, quantity: 2 };

    component.selectedProducts = [product1, product2];

    const totalAmount = component.calculateTotalAmount();

    expect(totalAmount).toBe(10 * 3 + 5 * 2);
  });

  it('sendOrderToAPI - Deve enviar o pedido para a API corretamente', () => {
    const cliente = 'Mislene';

    const produto1 = { nome: 'Produto 1', quantity: 3 };
    const produto2 = { nome: 'Produto 2', quantity: 2 };

    spyOn(orderService, 'sendOrderToBackend'); // Espiona o método sendOrderToBackend

    component.customerName = cliente;
    component.selectedProducts = [
      { product: produto1, quantity: produto1.quantity },
      { product: produto2, quantity: produto2.quantity }
    ];

    component.sendOrderToAPI();

    const pedidoEsperado = {
      client: cliente,
      products: [
        { nome: 'Produto 1', quantity: 3 },
        { nome: 'Produto 2', quantity: 2 }
      ],
      status: 'pending',
      dateEntry: jasmine.any(String),
      dateProcessed: ''
    };

    expect(orderService.sendOrderToBackend).toHaveBeenCalledWith(jasmine.objectContaining(pedidoEsperado));
    expect(component.customerName).toBe('');
  });

  it('sendOrderToAPI - Deve tratar erro ao enviar o pedido', () => {
    const cliente = 'Mislene';

    const produto1 = { nome: 'Produto 1', quantity: 3 };
    const produto2 = { nome: 'Produto 2', quantity: 2 };

    spyOn(orderService, 'sendOrderToBackend').and.throwError('Erro simulado');

    component.customerName = cliente;
    component.selectedProducts = [
      { product: produto1, quantity: produto1.quantity },
      { product: produto2, quantity: produto2.quantity }
    ];

    spyOn(console, 'error'); // Espiona a função console.error

    component.sendOrderToAPI();

    // Verifica se console.error foi chamado com a mensagem de erro esperada
    expect(console.error).toHaveBeenCalledWith('Erro ao enviar pedido:', 'Erro simulado');
    expect(component.customerName).toBe(cliente); // Garante que o nome do cliente não tenha sido apagado após o erro
  });

  it('sendOrderToAPI - Deve tratar erro desconhecido ao enviar pedido para o backend', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    // Simula um erro desconhecido ao chamar sendOrderToBackend
    spyOn(orderService, 'sendOrderToBackend').and.callFake(() => {
      throw new Error('Erro desconhecido');
    });

    component.sendOrderToAPI();

    // Verifique se console.error foi chamado com a mensagem correta
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao enviar pedido:', 'Erro desconhecido');
  });
});

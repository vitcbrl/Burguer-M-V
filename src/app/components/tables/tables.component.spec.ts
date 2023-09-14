import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablesComponent } from './tables.component';
import { OrderService } from '../services/order.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('TablesComponent', () => {
  let component: TablesComponent;
  let fixture: ComponentFixture<TablesComponent>;
  let orderService: jasmine.SpyObj<OrderService>; 
  let router: Router;

  beforeEach(() => {
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getReadyOrdersFromBackend', 'updateOrder']);
    orderServiceSpy.getReadyOrdersFromBackend.and.returnValue(of([])); // Simula retorno vazio

    TestBed.configureTestingModule({
      declarations: [TablesComponent],
      providers: [{provide: OrderService, useValue: orderServiceSpy}],
      imports: [HttpClientModule, RouterTestingModule]
    });

    fixture = TestBed.createComponent(TablesComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>; // Injeta o OrderService SpyObj
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - Deve chamar updateOrders() no ngOnInit', () => {
    spyOn(component, 'updateOrders');

    component.ngOnInit();

    expect(component.updateOrders).toHaveBeenCalled();
  });

  it('goToMenu - Deve navegar para o menu', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.goToMenu();

    expect(navigateSpy).toHaveBeenCalledWith(['/menu']);
  });

  it('updateOrders - Deve atualizar as listas de pedidos', () => {
    const ordersMock = [
      { entregue: false },
      { entregue: true },
      { entregue: false }
    ];

    orderService.getReadyOrdersFromBackend.and.returnValue(of(ordersMock)); // Simula retorno do serviço

    component.updateOrders();

    expect(component.readyOrders).toEqual([ordersMock[0], ordersMock[2]]);
    expect(component.deliveredOrders).toEqual([ordersMock[1]]);
  });

  it('markOrderAsDelivered - Deve marcar um pedido como entregue', () => {
    const order = {id: 1, entregue: false};
    orderService.updateOrder.and.returnValue(of(order));
  
    spyOn(component, 'updateOrders');

    component.markOrderAsDelivered(order);

    expect(order.entregue).toBeTrue();
    expect(orderService.updateOrder).toHaveBeenCalledWith(order);
    expect(component.updateOrders).toHaveBeenCalled(); // Verifica se o método foi chamado
  });

  it('markOrderAsDelivered - Deve lidar com erro ao marcar um pedido como entregue', () => {
    const order = {id: 1, entregue: false};
    const errorMessage = 'Erro ao marcar pedido como entregue';
    orderService.updateOrder.and.returnValue(throwError(errorMessage));  // Simula um erro

    spyOn(console, 'error'); // Espia a função console.error para verificar se é chamada

    component.markOrderAsDelivered(order);

    expect(orderService.updateOrder).toHaveBeenCalledWith(order);
    expect(console.error).toHaveBeenCalledWith('Error marking order as delivered:', errorMessage);
  });

  it('setActiveTab - Deve definir a aba corretamente ativa', () => {
    const tab = 'detalhes';

    component.setActiveTab(tab);

    expect(component.activeTab).toBe(tab);
  });

  it('calculateTotal - Deve calcular o total corretamente', () => {
    const order = {
      products: [
        {price: 10, quantity: 2},
        {price: 20, quantity: 1}
      ]
    };

    const total = component.calculateTotal(order);

    expect(total).toBe(40);
  });

  it('calculatePreparationTime - Deve calcular o tempo de preparo corretamente', () => {
    const order = {
      status: 'ready',
      dateEntry: '2023-08-30T12:00:00Z',
      dateProcessed: '2023-08-30T12:30:00Z'
    };

    const result = component.calculatePreparationTime(order);

    expect(result).toBe('30 min');
  });

  it('calculatePreparationTime - Deve retornar string vazia se o status mencionado não for "ready"', () => {
    const order = {
      status: 'pending', // Exemplo de status diferente de 'ready'
      dateEntry: '2023-08-30T12:00:00Z',
      dateProcessed: '2023-08-30T12:30:00Z'
    };

    const result = component.calculatePreparationTime(order);

    expect(result).toBe('');
  });

  it('calculatePreparationTime - Deve retornar string vazia se as datas não estiverem definidas', () => {
    const order = {
      status: 'ready',
      dateEntry: null,
      dateProcessed: null
    };

    const result = component.calculatePreparationTime(order);

    expect(result).toBe('');
  });
});

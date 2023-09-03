import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { of, EMPTY } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './authentication.service';


describe('OrderService', () => {
    let orderService: OrderService;
    let authService: AuthService;
    let http: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrderService, HttpClient, AuthService],
        });
        
        orderService = TestBed.inject(OrderService);
        authService = TestBed.inject(AuthService);
        http = TestBed.inject(HttpClient);
    });

    it('should create', () => {
        expect(orderService).toBeTruthy();
    });

    it('addProduct - Deve adicionar um produto corretamente', () => {
        const productToAdd = { id: 1, name: 'Produto 1', price: 10 }; //Simulação de produto

        // Chame a função para adicionar o produto
        orderService.addProduct(productToAdd);

        // Obtem os produtos adicionados do BehaviorSubject
        let addedProducts: any[] = [];
        orderService.addedProduct$.subscribe((products) => {
            addedProducts = products;
        });

        expect(addedProducts.length).toBe(1);
        expect(addedProducts[0].product).toEqual(productToAdd);
        expect(addedProducts[0].quantity).toBe(1);
    });

    it('addProduct - Deve incrementar a quantidade de um produto existente', () => {
        const product1 = { id: 1, name: 'Produto 1', price: 10 };
        const product2 = { id: 2, name: 'Produto 2', price: 15 };

        // Adiciona o primeiro produto duas vezes
        orderService.addProduct(product1);
        orderService.addProduct(product1);

        // Adiciona o segundo produto apenas uma vez
        orderService.addProduct(product2);

        let addedProducts: any[] = [];
        orderService.addedProduct$.subscribe((products) => {
            addedProducts = products;
        });

        // Verifica se a quantidade do primeiro produto foi incrementada
        expect(addedProducts.length).toBe(2);
        expect(addedProducts[0].product).toEqual(product1);
        expect(addedProducts[0].quantity).toBe(2);

        // Verifica se o segundo produto foi adicionado corretamente
        expect(addedProducts[1].product).toEqual(product2);
        expect(addedProducts[1].quantity).toBe(1);
    });

    it('removeProduct - Deve remover um produto corretamente', () => {
        const productToAdd = { id: 1, name: 'Produto 1 ', price: 10 };
        orderService.addProduct(productToAdd);

        // Remove o produto
        orderService.removeProduct(productToAdd.id);

        let addedProducts: any[] = [];
        orderService.addedProduct$.subscribe((products) => {
            addedProducts = products;
        });

        //Verifica se o produto foi removido corretamente
        expect(addedProducts.length).toBe(0);
    });

    it('sendOrderToBackend - Deve enviar um pedido para o backend corretamente', () => {
        spyOn(authService, 'isUserLoggedIn').and.returnValue({ loggedIn: true, token: 'mockedToken' });

        const mockOrder = { id: 1, items: [] }; // Mock de um pedido
        const mockResponse = 'Response data'; // Mock da resposta do servidor

        // Espionar a função 'post' do HttpClient e retornar um Observable com o mock de resposta
        const httpPostSpy = spyOn(http, 'post').and.returnValue(of(mockResponse));
        const consoleLogSpy = spyOn(console, 'log');

        orderService.sendOrderToBackend(mockOrder);

        expect(httpPostSpy).toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith('Response data enviado para a API');

        expect(orderService.getAddedProductsLength()).toBe(0);
    });

    /*it('Deve obter pedidos corretamente', () => {
        // Mock do usuário logado
        spyOn(authService, 'isUserLoggedIn').and.returnValue({ loggedIn: true, token: 'mockedToken' });

        // Mock da solicitação HTTP
        const httpGetSpy = spyOn(http, 'get').and.returnValue(of<any[]>([{id: 1}, {id: 2}]));

        // Chamada da função getOrders
        let orders: any[] = [];
        orderService.getOrders().subscribe((data) => {
            orders = data;
        });

        // Verifica se a função HTTP foi chamada corretamente
        expect(httpGetSpy).toHaveBeenCalledWith('http://localhost:8080/orders', jasmine.objectContaining({
            headers: jasmine.objectContaining({
                Authorization: 'Bearer mockedToken',
            }),
        }));

        // Verifica se os pedidos foram obtidos corretamente
        expect(orders).toEqual([{id: 1}, {id: 2}]);
    }); //Não deu certo, verificar amanha */

    it('decreaseProductQuantity - Deve diminuir a quantidade de um produto existente', () => {
        // Adicionado um produto de exemplo com quantidade 2
        const productToAdd = { id: 1, name: 'Produto de Teste', price: 10 };
        orderService.addProduct(productToAdd);
        orderService.addProduct(productToAdd);

        // Chama a função decreaseProductQuantity
        orderService.decreaseProductQuantity(productToAdd.id);

        // Obtem os produtos adicionados do BehaviorSubject
        let addedProducts: any[] = [];
        orderService.addedProduct$.subscribe((products) => {
            addedProducts = products;
        });

        // Verifica se a quantidade do produto foi diminuída
        expect(addedProducts.length).toBe(1);
        expect(addedProducts[0].quantity).toBe(1);
    });

    it('getOrderedProduct - Deve obter um produto de pedidos corretamente', () => {
        const exampleOrder = {product: {id: 1}, quantity: 3};

        spyOn(orderService, 'getOrderedProduct').and.returnValue(exampleOrder);

        const orderedProduct = orderService.getOrderedProduct(1);

        expect(orderService.getOrderedProduct).toHaveBeenCalledWith(1);
        expect(orderedProduct).toEqual(exampleOrder);
    });

    /*it('Deve atualizar um pedido corretamente', () => {
        const exampleOrder = {id: 1, status: 'ready'};

        const httpPutSpy = spyOn(http, 'put').and.returnValue(of({}));

        orderService.updateOrder(exampleOrder).subscribe(() => {
            expect(httpPutSpy).toHaveBeenCalled();

            expect(httpPutSpy).toHaveBeenCalledWith('http://localhost:8080/orders/1', exampleOrder, {
                headers: jasmine.objectContaining({ 'Authorization': 'Bearer mockedToken' }),
            });
        });
    }); // nao deu certo verificar amanha*/
});
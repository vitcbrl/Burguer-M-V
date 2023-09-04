import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProductService } from "./product.service";
import { AuthService } from "./authentication.service";

describe('ProductService', () => {
    let productService: ProductService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService, AuthService]
        });

        productService = TestBed.inject(ProductService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(productService).toBeTruthy();
    });

    it('getProducts - Deve retornar produtos quando o usuário estiver logado', () => {
        const tokenDummy = 'tokenDummy';
        const respostaDummy = [{ id: 1, nome: 'Produto 1' }, { id: 2, nome: 'Produto 2' }];

        spyOn(productService['authService'], 'isUserLoggedIn').and.returnValue({ loggedIn: true, token: tokenDummy });

        productService.getProducts().subscribe((produtos) => {
            expect(produtos).toEqual(respostaDummy);
        });

        const req = httpTestingController.expectOne('http://localhost:8080/products');
        expect(req.request.method).toEqual('GET');
        expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${tokenDummy}`);

        req.flush(respostaDummy);
    });

    it('getProducts - Deve lançar um erro quando o usuário não estiver logado', () => {
        spyOn(productService['authService'], 'isUserLoggedIn').and.returnValue({ loggedIn: false, token: null});

        expect(() => {
            productService.getProducts().subscribe();
        }).toThrowError('Usuário não logado');
    });
})
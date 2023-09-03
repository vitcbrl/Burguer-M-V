import { TestBed } from '@angular/core/testing';
import { AuthService } from './authentication.service';
import { throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
    let authService: AuthService;
    let httpClientSpy: { post: jasmine.Spy }; // função login
    let routerSpy: jasmine.SpyObj<Router>; //função logout

    beforeEach(() => {
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService,
                { provide: HttpClient, useValue: httpClientSpy },
                { provide: Router, useValue: routerSpyObj },
            ],
        });

        authService = TestBed.inject(AuthService);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(authService).toBeTruthy();
    });

    it('login - Deve retornar verdadeiro após um login bem sucedido', () => {
        const email = 'teste@teste.com';
        const password = 'senha123456';

        const mockAnswer = {
            accessToken: 'token123456',
            user: {
                role: 'usuario',
            },
        };

        httpClientSpy.post.and.returnValue(of(mockAnswer));

        authService.login(email, password).subscribe((result) => {
            expect(result).toBe(true);
        });
    });

    it('login - Deve lidar com credenciais inválidas', () => {
        const email = 'invalido@invalido.com';
        const password = 'senhainvalida';

        const menssageError = 'Ocorreu um erro durante o login. Por favor, tente novamente.';

        httpClientSpy.post.and.returnValue(throwError({ error: { message: menssageError } }));

        authService.login(email, password).subscribe(() => {
            fail('Erro esperado');
        },
            (erro) => {
                expect(erro).toBe(menssageError);
            });
    });

    it('isUserLoggedIn - Deve verificar se o usuário está logado corretamente', () => {
        localStorage.setItem('accessToken', 'token123');  // Simula que o usuário está logado

        const resultLoggedIn = authService.isUserLoggedIn();

        expect(resultLoggedIn.loggedIn).toBe(true);
        expect(resultLoggedIn.token).toBe('token123');

        // Agora, verifica o cenário em que o usuário não está logado
        localStorage.removeItem('accessToken');

        const resultNotLoggedIn = authService.isUserLoggedIn();

        expect(resultNotLoggedIn.loggedIn).toBe(false);
        expect(resultNotLoggedIn.token).toBe(null);
    });

    it('getUserRole - Deve obter a função do usuário corretamente', () => {
        localStorage.setItem('accessRole', 'service'); // Simula que a função do usuário está definida

        const resultWithRole = authService.getUserRole();
        expect(resultWithRole).toBe('service');

        // Verifica o cenário em que a função do usuário não está definida
        localStorage.removeItem('accessRole'); // Simula que a função do usuário não está definida

        const resultWithoutRole = authService.getUserRole();
        expect(resultWithoutRole).toBe(null);
    });

    it('getUserEmail - Deve obter o email do usuário corretamente', () => {
        localStorage.setItem('userEmail', 'usuario@teste.com'); // Simula que o email do usuário está definido

        const userEmail = authService.getUserEmail();
        expect(userEmail).toBe('usuario@teste.com');

        // Verifica o cenário em que o email do usuário não se encontra definido
        localStorage.removeItem('userEmail'); // Simula que o email não está definido

        const userEmailNull = authService.getUserEmail();
        expect(userEmailNull).toBe(null);
    });

    it('storageToken - Deve armazenar o token no localStorage', () => {
        authService.storageToken('token123'); // Chama a função para armazenar o token

        const storedToken = localStorage.getItem('token');
        expect(storedToken).toBe('token123');
    });

    it('logout - Deve remover o token e o email do usuário e navegar para a página inicial de login após logout', () => {
        localStorage.setItem('token', 'token123');
        localStorage.setItem('userEmail', 'usuario@teste.com');

        authService.logout();

        //Verifica se o token e o email do usuário foram removidos 
        const storedToken = localStorage.getItem('token');
        const storedUserEmail = localStorage.getItem('userEmail');

        expect(storedToken).toBeNull();
        expect(storedUserEmail).toBeNull();

        // Verifica se a função navigate foi chamada com a rota positivamente
        expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('getUsername - Deve obter o nome de usuário corretamente', () => {
        localStorage.setItem('username', 'usuario123'); // Simula que o nome do usuário está definido

        const userName = authService.getUsername();
        expect(userName).toBe('usuario123');

        // Verifica o cenário em que o nome do usuário não está como definido
        localStorage.removeItem('username'); // Simula que o nome não está definido

        const userNameNull = authService.getUsername();
        expect(userNameNull).toBeNull();
    });
});
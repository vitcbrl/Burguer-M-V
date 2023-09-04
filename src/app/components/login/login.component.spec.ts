import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login - Deve poder navegar para a rota correta após login bem sucedido', () => {
    const mockLoginObservable = of(true);
    mockAuthService.login.and.returnValue(mockLoginObservable);
    localStorage.setItem('accessRole', 'service'); // simulando o role do usuário garçonete

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith(component.email, component.password);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/menu']);
  });

  it('login - Deve exibir uma mensagem de erro ao fazer login com credenciais inválidas', () => {
    const mockLoginObservable = of(false);
    mockAuthService.login.and.returnValue(mockLoginObservable);

    component.login();

    expect(component.errorLogin).toBeTrue();
    expect(component.errorMessage).toEqual('Invalid login');
  });
});

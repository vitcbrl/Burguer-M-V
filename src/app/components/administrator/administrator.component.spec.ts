import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministratorComponent } from './administrator.component';
import { AuthService } from '../services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UserService } from '../services/user.service';


describe('AdministratorComponent', () => {
  let component: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorComponent],
      providers: [AuthService, UserService],
      imports: [HttpClientModule, HttpClientTestingModule, FormsModule],
    });
    fixture = TestBed.createComponent(AdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve chamar loadEmployees() no ngOnInit', () => {
    const getEmployeesSpy = spyOn(userService, 'getEmployees').and.returnValue(of([]));
    
    component.ngOnInit();

    expect(getEmployeesSpy).toHaveBeenCalled();
  });

  it('Deve chamar AuthService.logout() no logout', () => {
    const logoutSpy = spyOn(authService, 'logout');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('Deve chamar loadEmployees e atualizar employees com sucesso', () => {
    const mockEmployees = [{ id: 1, name: 'Funcionário 1' }];
    const mockResponse = of(mockEmployees);

    spyOn(userService, 'getEmployees').and.returnValue(mockResponse);

    component.loadEmployees();

    expect(userService.getEmployees).toHaveBeenCalled();

    expect(component.employees).toEqual(mockEmployees);
  });

  it('Deve tratar erro ao chamar loadEmployees()', () => {
    const errorResponse = 'Usuário não está logado';
    spyOn(userService, 'getEmployees').and.returnValue(throwError(errorResponse));

   const consoleErrorSpy = spyOn(console, 'error');

    component.loadEmployees();


    expect(userService.getEmployees).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar funcionários');
  });
});

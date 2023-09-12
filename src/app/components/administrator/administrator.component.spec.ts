import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministratorComponent } from './administrator.component';
import { AuthService } from '../services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
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
    // Crie um valor observável simulando uma lista vazia de funcionários
    const emptyEmployeesObservable = of([]);

    // Crie um espião para a função getEmployees e faça-o retornar o valor observável
    spyOn(userService, 'getEmployees').and.returnValue(emptyEmployeesObservable);
    
    component.ngOnInit();

    // Agora, o espião deve retornar um valor observável simulando sucesso
    expect(component.employees).toEqual([]); // Verifique se a variável do componente foi atualizada corretamente
  });

  it('Deve chamar AuthService.logout() no logout', () => {
    const logoutSpy = spyOn(authService, 'logout');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('Deve atualizar o papel para "chefe" quando o papel for "Cozinheiro"', () => {
    // Arrange
    component.employeeToUpdate = { role: 'Cozinheiro' };

    // Act
    component.updateEmployee();

    // Assert
    expect(component.employeeToUpdate.role).toBe('chefe');
  });

  it('Deve atualizar o papel para "service" quando o papel for "Garçom"', () => {
    // Arrange
    component.employeeToUpdate = { role: 'Garçom' };

    // Act
    component.updateEmployee();

    // Assert
    expect(component.employeeToUpdate.role).toBe('service');
  });

  it('Não deve fazer nada quando o papel não for "Cozinheiro" ou "Garçom"', () => {
    // Arrange
    component.employeeToUpdate = { role: 'OutroPapel' };
    const initialRole = component.employeeToUpdate.role;

    // Act
    component.updateEmployee();

    // Assert
    expect(component.employeeToUpdate.role).toBe(initialRole); // O papel não deve ser alterado
  });
  it('Deve chamar UserService.addEmployee() e atualizar a lista de funcionários ao adicionar um funcionário com sucesso', () => {
    // Arrange
    const newEmployee = { name: 'Novo Funcionário', role: 'Cozinheiro' }; // ou qualquer outro papel desejado
  
    // Crie um valor observável simulando uma resposta de sucesso ao adicionar um funcionário
    const successResponse = { /* aqui você pode criar um objeto simulando a resposta de sucesso */ };
    const addEmployeeSpy = spyOn(userService, 'addEmployee').and.returnValue(of(successResponse));
  
    // Crie espiões para os métodos chamados dentro de addEmployee()
    const loadEmployeesSpy = spyOn(component, 'loadEmployees');
    const resetFormSpy = spyOn(component, 'resetForm');
  
    // Act
    component.newEmployee = newEmployee; // Defina newEmployee no componente
    component.addEmployee();
  
    // Assert
    expect(addEmployeeSpy).toHaveBeenCalledWith(newEmployee); // Verifique se addEmployee foi chamado com o novo funcionário
    expect(loadEmployeesSpy).toHaveBeenCalled(); // Verifique se loadEmployees foi chamado após adicionar o funcionário
    expect(resetFormSpy).toHaveBeenCalled(); // Verifique se resetForm foi chamado após adicionar o funcionário
  });
  
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministratorComponent } from './administrator.component';
import { AuthService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { of, throwError, Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AdministratorComponent', () => {
  let component: AdministratorComponent;
  let fixture: ComponentFixture<AdministratorComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let productService: jasmine.SpyObj<ProductService>;
  //let httpMock: HttpTestingController;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getEmployees', 'addEmployee', 'deleteEmployee']); // teste função ngOnInit, loadEmployees -, addEmployees
    userServiceSpy.getEmployees.and.returnValue(of([{ id: 1, nome: 'Funcionário 1' }, { id: 2, nome: 'Funcionário 2' }])); // teste função ngOnInit

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout', 'isUserLoggedIn']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'addProduct']);
    
    TestBed.configureTestingModule({
      declarations: [AdministratorComponent],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: AuthService, useValue: authServiceSpy},
        {provide: ProductService, useValue: productServiceSpy}
      ],
      imports: [FormsModule, HttpClientModule, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(AdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    //httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - deve carregar funcionários no ngOnInit', () => {
    const funcionariosFalsos = [{ id: 1, nome: 'Funcionário 1' }, { id: 2, nome: 'Funcionário 2' }];
    userService.getEmployees.and.returnValue(of(funcionariosFalsos));

    spyOn(component, 'loadEmployees').and.callThrough();

    component.ngOnInit();

    expect(component.loadEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(funcionariosFalsos);
  });

  it('logout - Deve chamar o método logout do AuthService quando logout é acionado', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('loadEmployees - Deve chamar userService.getEmployees e atualizar a propriedade employees', () => {
    const employees = [{ id: 1, name: 'Employee 1' }, { id: 2, name: 'Employee 2' }];
    userService.getEmployees.and.returnValue(of(employees));

    component.loadEmployees();

    expect(userService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(employees);
  });

  /*it('Deve chamar userService.addEmployee com sucesso', () => {
    const expectedEmployee = { id: 0, name: '', email: '', password: '', role: 'garçom' };
    
    const addEmployeeSpy = spyOn(userService, 'addEmployee').and.returnValue(of(expectedEmployee));

    component.addEmployee();

    expect(addEmployeeSpy).toHaveBeenCalledWith(expectedEmployee);

    expect(component.loadEmployees).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
  });*/

  it('addEmployee - Deve tratar erro ao chamar userService.addEmployee', () => {
    const errorMessage = 'Erro ao adicionar funcionário';
    userService.addEmployee.and.returnValue(throwError(errorMessage));

    component.addEmployee();

    expect(userService.addEmployee).toHaveBeenCalledWith(component.newEmployee);
  });

  it('resetForm - Deve redefinir o formulário corretamente', () => {
    component.newEmployee = {name: 'Nome', email: 'email@example.com', password: 'senha123', role: 'garçom'};

    component.resetForm();

    expect(component.newEmployee).toEqual({name: '', email: '', password: '', role: 'garçom'});
  });

  /*it('Deve excluir um funcionário com confirmação', () => {
    spyOn(window, 'confirm').and.returnValue(true);


    component.deleteEmployee(1);

   
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir esse funcionário?');

  });*/

  it('showUpdateForm - Deve configurar isEditing como true e definir employeeToUpdate corretamente', () => {
    const employee = {
      id: 1,
      name: 'John Doe',
      role: 'Developer',
    };

    component.showUpdateForm(employee);

    expect(component.isEditing).toBe(true);
    expect(component.employeeToUpdate).toEqual(employee);
  });

  /*it('Deve atualizar um funcionário com sucesso', () => {
    const employeeToUpdate = {
      id: 1,
      name: 'John Doe',
      role: 'Cozinheiro',
    };

    const updateEmployeeSpy = spyOn(userService, 'updateEmployee').and.returnValue(of({}));

    component.employeeToUpdate = { ...employeeToUpdate };

    component.updateEmployee();

    expect(updateEmployeeSpy).toHaveBeenCalledWith(employeeToUpdate.id, employeeToUpdate);

    expect(component.loadEmployees).toHaveBeenCalled();
    expect(component.cancelUpdate).toHaveBeenCalled();
  });

  it('cancelUpdate - Deve cancelar a edição e redefinir os valores', () => {
    component.isEditing = true;
    component.employeeToUpdate = { id: 1, name: 'Nome', role: 'Cargo' };

    component.cancelUpdate();

    expect(component.isEditing).toBe(false);
    expect(component.employeeToUpdate).toEqual({ id: 0, name: '', role: '' });
  });

  /*it('setActiveTab - Deve definir a aba ativa e atualizar a exibição da seção de funcionários corretamente', () => {
    authService.isUserLoggedIn.and.returnValue({ loggedIn: true, token: 'fakeToken' });
    
    component.activeTab = 'outra_aba';
    component.isEmployeesTabActive = true;
    component.setActiveTab('produtos');

    expect(component.activeTab).toBe('produtos');

    expect(component.isEmployeesTabActive).toBe(false);

    component.setActiveTab('outra_aba');

    expect(component.activeTab).toBe('outra_aba');

    expect(component.isEmployeesTabActive).toBe(true);
  });*/

  it('loadProducts - Deve carregar produtos com sucesso', () => {
    const mockProductsResponse = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]; // Defina a resposta simulada

    productService.getProducts.and.returnValue(of(mockProductsResponse));

    component.loadProducts();

    expect(productService.getProducts).toHaveBeenCalledOnceWith(); // Verifique se a função foi chamada
    expect(component.products).toEqual(mockProductsResponse); // Verifique se a variável products foi atualizada corretamente
  });

  /*it('updateEmployee - Deve atualizar o papel para "chefe" quando o papel for "Cozinheiro"', () => {
    component.employeeToUpdate = { role: 'Cozinheiro' };

    component.updateEmployee();

    expect(component.employeeToUpdate.role).toBe('chefe');
  });

  it('updateEmployee - Deve atualizar o papel para "service" quando o papel for "Garçom"', () => {
    component.employeeToUpdate = { role: 'Garçom' };

    component.updateEmployee();

    expect(component.employeeToUpdate.role).toBe('service');
  });

  it('updateEmployee - Não deve fazer nada quando o papel não for "Cozinheiro" ou "Garçom"', () => {
    component.employeeToUpdate = { role: 'OutroPapel' };
    const initialRole = component.employeeToUpdate.role;

    component.updateEmployee();

    expect(component.employeeToUpdate.role).toBe(initialRole); // O papel não deve ser alterado
  });

  it('addEmployee - Deve chamar UserService.addEmployee() e atualizar a lista de funcionários ao adicionar um funcionário com sucesso', () => {
    
    const newEmployee = { name: 'Novo Funcionário', role: 'Cozinheiro' }; // ou qualquer outro papel desejado
  
    const successResponse = {};
    const addEmployeeSpy = spyOn(userService, 'addEmployee').and.returnValue(of(successResponse));
  
    const loadEmployeesSpy = spyOn(component, 'loadEmployees');
    const resetFormSpy = spyOn(component, 'resetForm');
  
    component.newEmployee = newEmployee; // Defina newEmployee no componente
    component.addEmployee();
  
    expect(addEmployeeSpy).toHaveBeenCalledWith(newEmployee); // Verifique se addEmployee foi chamado com o novo funcionário
    expect(loadEmployeesSpy).toHaveBeenCalled(); // Verifique se loadEmployees foi chamado após adicionar o funcionário
    expect(resetFormSpy).toHaveBeenCalled(); // Verifique se resetForm foi chamado após adicionar o funcionário
  });

  it('setActiveTab - Deve ativar a aba "Produtos" corretamente', () => {
    const tab = 'produtos';
  
    const loadProductsSpy = spyOn(component, 'loadProducts');
  
    component.setActiveTab(tab);
  
    expect(component.activeTab).toBe(tab); // Verifique se a aba ativa foi definida corretamente
    expect(component.isEmployeesTabActive).toBe(false); // Verifique se isEmployeesTabActive foi definido como false
    expect(loadProductsSpy).toHaveBeenCalled(); // Verifique se a função loadProducts foi chamada
  });
  
  it('setActiveTab - Deve ativar a exibição de funcionários corretamente para outras abas', () => {
    const tab = 'outra_aba_qualquer';
  
    component.setActiveTab(tab);
  
    expect(component.activeTab).toBe(tab); // Verifique se a aba ativa foi definida corretamente
    expect(component.isEmployeesTabActive).toBe(true); // Verifique se isEmployeesTabActive foi definido como true
  });*/
  
});

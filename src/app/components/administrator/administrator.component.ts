import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  employees: any[] = [];
  newEmployee: any = { id: 0, name: '', email: '', password: '', role: 'garçom' };
  isEditing = false;
  employeeToUpdate: any = { id: 0, name: '', role: '' };
  products: any[] = [];
  activeTab: string = 'funcionarios';

  isEmployeesTabActive: boolean = true;  // Variável para controlar a exibição da seção de funcionários

  constructor(private userService: UserService, private authService: AuthService, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  logout() {
    this.authService.logout();
  }

  loadEmployees() {
    this.userService.getEmployees().subscribe(
      (employees: any[]) => {
        this.employees = employees;
      },
      (error: any) => {
        console.error('Erro ao carregar funcionários', error);
      }
    );
  }

  addEmployee() {
    this.userService.addEmployee(this.newEmployee).subscribe(
      (response: any) => {
        console.log('Funcionário adicionado com sucesso', response);
        this.loadEmployees();
        this.resetForm();
      },
      (error: any) => {
        console.error('Erro ao adicionar funcionário', error);
      }
    );
  }

  resetForm() {
    this.newEmployee = { name: '', email: '', password: '', role: this.newEmployee.role };
  }

  deleteEmployee(employeeId: number) {
    if (confirm('Tem certeza que deseja excluir esse funcionário?')) {
      this.userService.deleteEmployee(employeeId).subscribe(
        (response: any) => {
          console.log('Funcionário excluído com sucesso', response);
          this.loadEmployees();
        },
        (error: any) => {
          console.error('Erro ao excluir funcionário', error);
        }
      );
    }
  }

  showUpdateForm(employee: any) {
    this.isEditing = true;
    this.employeeToUpdate = { ...employee };
  }

  updateEmployee() {
    if (this.employeeToUpdate.role === 'Cozinheiro') {
      this.employeeToUpdate.role = 'chefe';
    } else if (this.employeeToUpdate.role === 'Garçom') {
      this.employeeToUpdate.role = 'service';
    }

    this.userService.updateEmployee(this.employeeToUpdate.id, this.employeeToUpdate).subscribe(
      (response: any) => {
        console.log('Dados do funcionário atualizados com sucesso', response);
        this.loadEmployees();
        this.cancelUpdate();
      },
      (error: any) => {
        console.error('Erro ao atualizar funcionário', error);
      }
    );
  }

  cancelUpdate() {
    this.isEditing = false;
    this.employeeToUpdate = { id: 0, name: '', role: '' };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'produtos') {
      this.loadProducts();
      this.isEmployeesTabActive = false;  // Desativa a exibição da seção de funcionários quando a aba "Produtos" estiver ativa
    } else {
      this.isEmployeesTabActive = true;   // Ativa a exibição da seção de funcionários quando qualquer outra aba estiver ativa
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (products: any[]) => {
        console.log('Dados dos produtos recebidos com sucesso:', products);
        this.products = products[0];
      },
      (error: any) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }  
}

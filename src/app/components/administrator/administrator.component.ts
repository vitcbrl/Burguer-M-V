import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/authentication.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  employees: any[] = [];
  newEmployee: any = { id: 0, name: '', email: '', password: '', role: 'garçom' }; // Inicializado com ID 0
  isEditing = false;
  employeeToUpdate: any = { id: 0, name: '', role: '' }; // Inicializado com ID 0

  constructor(private userService: UserService , private authService: AuthService) {}

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
    this.userService.updateEmployee(this.employeeToUpdate.id, this.employeeToUpdate).subscribe(
      (response: any) => {
        console.log('Dados do funcionário atualizados com sucesso', response);
        this.loadEmployees(); // Atualize a lista após a atualização bem-sucedida.
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
}

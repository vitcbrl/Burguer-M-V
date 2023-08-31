import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  employees: any[] = [];
  newEmployee: any = { id: 0, name: '', email: '', password: '', role: 'garçom' }; // Inicializado com ID 0

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadEmployees();
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
    // Busque o último ID utilizado dos funcionários existentes
    const lastEmployee = this.employees[this.employees.length - 1];
    const newId = lastEmployee ? lastEmployee.id + 1 : 1; // Incremente o ID

    // Preencha os detalhes do novo funcionário
    this.newEmployee.id = newId;

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
}



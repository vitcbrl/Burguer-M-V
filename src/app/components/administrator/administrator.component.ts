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
  newEmployee: any = { id: '', name: '', email: '', password: '', role: 'garçom' };

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
    // Gere um ID aleatório usando o uuidv4() instalei com o comando npm install uuid

    const newId = uuidv4();

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




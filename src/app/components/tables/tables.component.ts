import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  readyOrders: any[] = []; //aqui recebe meus pedidos e faço a manipulação de valores

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.updateReadyOrders(); //passo aqui dentro para ser a primeira coisa que ela ve na tela
  }

  updateReadyOrders() {
    this.orderService.getReadyOrdersFromBackend().subscribe( //uso a função que criei no order service e ela me traz os pedidos que estão com ready logo apos passo um callback para trazer essa variavel que é orders
      (orders) => { 
        this.readyOrders = orders; //minha variavel aqui dentro que contem meus pedidos do backeend
      },
      (error) => {
        console.error('Error fetching ready orders:', error);
      }
    );
  }}

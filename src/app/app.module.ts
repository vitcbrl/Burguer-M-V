import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';//adicionei
import { HttpClientModule } from '@angular/common/http'; //adicionei
import { RouterModule } from '@angular/router'; // adicionei
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module'; 
import { MenuComponent } from './components/menu/menu.component';
import { OrderComponent } from './components/order/order.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    AppRoutingModule, 
  ],
  exports: [
    LoginComponent,
    MenuComponent,
    OrderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
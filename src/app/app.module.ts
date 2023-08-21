import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';//adicionei
import { HttpClientModule } from '@angular/common/http'; //adicionei
import { RouterModule } from '@angular/router'; // adicionei
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module'; 
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]), // Configure your routes here
    AppRoutingModule, // Importe o AppRoutingModule aqui
  ],
  exports: [
    LoginComponent,
    MenuComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
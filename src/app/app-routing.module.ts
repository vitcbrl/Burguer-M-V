import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { CookedComponent } from './components/cooked/cooked.component';
import { TablesComponent } from './components/tables/tables.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'cozinha',
    component: CookedComponent
  },
  {
    path: 'tables',
    component: TablesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


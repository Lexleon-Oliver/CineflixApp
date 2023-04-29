import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ErrorComponentComponent } from './error-component/error-component.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';
import { RendererizaFilmeComponent } from './main/rendereriza-filme/rendereriza-filme.component';

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "main/:id", component: MainComponent,canActivate:[AuthGuard]},
  {path: "series", component: MainComponent,canActivate:[AuthGuard]},
  {path: "filmes", component: MainComponent,canActivate:[AuthGuard]},
  {path: "series/:id", component: MainComponent,canActivate:[AuthGuard]},
  {path: "filmes/:id", component: MainComponent,canActivate:[AuthGuard]},
  {path: "novo-filme", component: MainComponent,canActivate:[AuthGuard]},
  {path: "nova-serie", component: MainComponent,canActivate:[AuthGuard]},
  {path: "users", component: UsersComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: '**', component: ErrorComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

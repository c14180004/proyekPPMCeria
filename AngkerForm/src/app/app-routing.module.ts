import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'new-form',
    loadChildren: () => import('./new-form/new-form.module').then( m => m.NewFormPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'isi-form/:formID',
    loadChildren: () => import('./isi-form/isi-form.module').then( m => m.IsiFormPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'detail-form/:formID',
    loadChildren: () => import('./detail-form/detail-form.module').then( m => m.DetailFormPageModule),
    canActivate: [AuthService]
  }




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

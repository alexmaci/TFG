import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  {
    path: 'tabs',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)

  },
  {
    path: 'nuevo-usuario',
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./pages/nuevo-usuario/nuevo-usuario.module').then(m => m.NuevoUsuarioPageModule)
  },
  {
    path: 'editar/:id',
    loadChildren: () => import('./pages/editar/editar.module').then(m => m.EditarPageModule)
  },
  {
    path: 'detalles-empresa/:id',
    loadChildren: () => import('./pages/detalles-empresa/detalles-empresa.module').then(m => m.DetallesEmpresaPageModule)
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./pages/detalle/detalle.module').then(m => m.DetallePageModule)
  },
  {
    path: 'nueva-empresa',
    loadChildren: () => import('./pages/nueva-empresa/nueva-empresa.module').then(m => m.NuevaEmpresaPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs'
  },

  {
    path: 'filtros',
    loadChildren: () => import('./pages/filtros/filtros.module').then(m => m.FiltrosPageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

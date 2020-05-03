import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaEmpresaPage } from './nueva-empresa.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaEmpresaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaEmpresaPageRoutingModule {}

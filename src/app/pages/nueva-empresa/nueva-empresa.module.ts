import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaEmpresaPageRoutingModule } from './nueva-empresa-routing.module';

import { NuevaEmpresaPage } from './nueva-empresa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaEmpresaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NuevaEmpresaPage]
})
export class NuevaEmpresaPageModule { }

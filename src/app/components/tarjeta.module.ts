import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaComponent } from './tarjeta/tarjeta.component';
import { IonicModule } from '@ionic/angular';
import { LargoPipe } from '../pipes/largo.pipe';



@NgModule({
  declarations: [TarjetaComponent, LargoPipe],
  exports: [TarjetaComponent],
  imports: [
    CommonModule, IonicModule
  ]
})
export class TarjetaModule { }

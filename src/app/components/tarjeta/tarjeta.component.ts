import { Component, OnInit, Input } from '@angular/core';
import { EmpresaNueva } from '../../models/empresaNueva.model';
import { storage } from 'firebase';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss'],
})
export class TarjetaComponent implements OnInit {

  @Input() empresaRecibida: any;
  empresa: any;
  imagen: string;

  constructor() {

  }

  ngOnInit() {
    this.empresa = this.empresaRecibida;
    this.cargarImagen();
  }

  cargarImagen() {
    if (this.empresa.imagen != null) {
      storage().ref(this.empresa.imagen).getDownloadURL().then(
        (data) => {
          this.imagen = data;
        }
      );
    }
    if (this.empresa.img != null) {
      storage().ref(this.empresa.img).getDownloadURL().then(
        (data) => {
          this.imagen = data;
        }
      );
    }
  }






}

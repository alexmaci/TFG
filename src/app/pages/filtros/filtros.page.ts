import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
import { SectoresService } from '../../services/sectores.service';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.page.html',
  styleUrls: ['./filtros.page.scss'],
})
export class FiltrosPage implements OnInit {

  @Input() empresas: Empresa[];
  empresasFiltradas: Empresa[];
  sectores: any[];
  distancia = 101;
  sector = '';
  latitud: number;
  longitud: number;

  constructor(private secotresService: SectoresService, public modalController: ModalController, private location: Geolocation) { }

  ngOnInit() {
    this.getSectores();
    this.setPosicion();
  }

  getSectores() {
    this.secotresService.getSectores().subscribe(
      (data) => {
        this.sectores = data;
      }, (rej) => {
        console.log(rej);
      }
    );
  }

  pulsadoBoton() {
    this.empresasFiltradas = [];

    for (const empresa of this.empresas) {

      //los dos filtros activos
      if (this.distancia !== 101 && this.sector.trimLeft().trimRight() !== '') {
        // tslint:disable-next-line: max-line-length
        if (this.distancia >= this.distanceInKmBetweenEarthCoordinates(this.latitud, this.longitud, empresa.latitud, empresa.longitud) && this.sector === empresa.sector.trimLeft().trimRight()) {
          this.empresasFiltradas.push(empresa);
        }
      } else if (this.distancia !== 101) {
        if (this.distancia >= this.distanceInKmBetweenEarthCoordinates(this.latitud, this.longitud, empresa.latitud, empresa.longitud)) {
          this.empresasFiltradas.push(empresa);
        }
      } else if (this.sector.trimLeft().trimRight() !== '') {
        if (this.sector.trimLeft().trimRight() === empresa.sector.trimLeft().trimRight()) {
          this.empresasFiltradas.push(empresa);
        }
      }


    }

    if (this.empresasFiltradas.length === 0) {
      //no se han filtrado empresas
      this.modalController.dismiss(this.empresas);
      console.log('no filter');
    } else {
      //se han filtrado empresas
      console.log('filter');
      this.modalController.dismiss(this.empresasFiltradas);
    }

  }
  pulsadoCancelar() {
    this.modalController.dismiss(this.empresas);
  }

  async setPosicion() {
    const rta = await this.location.getCurrentPosition();
    this.latitud = rta.coords.latitude;
    this.longitud = rta.coords.longitude;
  }


  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

}

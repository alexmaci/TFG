import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresasPrivadasService } from '../../services/empresas-privadas.service';
import { EmpresaNueva } from '../../models/empresaNueva.model';
import { storage } from 'firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

declare var google;

@Component({
  selector: 'app-detalles-empresa',
  templateUrl: './detalles-empresa.page.html',
  styleUrls: ['./detalles-empresa.page.scss'],
})
export class DetallesEmpresaPage implements OnInit {

  empresa: EmpresaNueva;
  imagen = 'assets/img/placeholder.png';;
  marker: any;

  constructor(private router: ActivatedRoute, private empresaService: EmpresasPrivadasService, private location: Geolocation, private launchNavigator: LaunchNavigator) { }

  ngOnInit() {
    this.getEmpresa();
  }

  getEmpresa() {
    this.router.params.subscribe(
      (datos) => {
        this.empresaService.getEmpresa(datos.id).subscribe(
          (data) => {
            this.empresa = data;
            this.cargarImagen();
            this.loadMap();
          });
      }
    );
  }

  cargarImagen() {
    if (this.empresa.imagen != null) {
      storage().ref(this.empresa.imagen).getDownloadURL().then(
        (data) => {
          this.imagen = data;
        }
      );
    }
    if (this.empresa.imagen != null) {
      storage().ref(this.empresa.imagen).getDownloadURL().then(
        (data) => {
          this.imagen = data;
        }
      );
    }
  }
  loadMap() {

    const coord = {
      lat: this.empresa.latitud,
      lng: this.empresa.longitud
    };

    const mapOptions = {
      zoom: 12,
      center: coord
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.marker = new google.maps.Marker({
      position: coord,
      map,
      draggable: false,
    });
  }

  navegar() {
    const options: LaunchNavigatorOptions = {

    };

    const direccion = `${this.empresa.latitud}, ${this.empresa.longitud}`;

    this.launchNavigator.navigate(direccion, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}

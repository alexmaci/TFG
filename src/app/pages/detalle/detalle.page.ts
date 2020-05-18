import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { storage } from 'firebase';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';


declare var google;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  empresa: Empresa;
  imagen = 'assets/img/placeholder.png';
  marker: any;


  constructor(private router: ActivatedRoute, private empresaService: EmpresaService, private launchNavigator: LaunchNavigator) { }

  ngOnInit() {
    this.getEmpresa();
  }

  getEmpresa() {
    this.router.params.subscribe(
      (datos) => {
        this.empresaService.recuperarEmpresa(datos.id).subscribe(
          (data) => {
            this.empresa = data;
            this.cargarImagen();
            this.loadMap();
          });
      }
    );
  }

  cargarImagen() {
    if (this.empresa.img != null) {
      storage().ref(this.empresa.img).getDownloadURL().then(
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

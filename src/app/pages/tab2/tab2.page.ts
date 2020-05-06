import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { ToastController, ModalController } from '@ionic/angular';
import { FiltrosPage } from '../filtros/filtros.page';
import { firestore } from 'firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  empresas: Empresa[];
  empresasFiltradasSectores: Empresa[] = [];
  empresasFiltradasDistancia: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  nombre = '';
  latitud: number;
  longitud: number;
  distancia = false;
  sector = false;

  constructor(public toastController: ToastController,
    private authService: AuthService, private empresasService:
      EmpresaService, private usuarioService: UsuarioService,
    public modalControler: ModalController, private location: Geolocation) {
    this.recuperarEmpresas();
    this.setPosicion();
  }

  recuperarEmpresas() {
    this.empresasService.recuperarEmpresas().subscribe(
      (acc) => {
        this.empresas = acc;
        this.empresasFiltradasDistancia = acc;
        this.empresasFiltradasSectores = acc;
        this.empresasFiltradas = acc;
      },
      (rej) => { console.log(rej); }
    );
  }
  seguirEmpresa(empresa: Empresa) {
    this.usuarioService.guardarEmpresa(this.authService.recuperarToken(), empresa.id);
    this.presentToast(empresa);

  }


  //Presentar mensaje flotante
  async presentToast(empresa: Empresa) {
    const toast = await this.toastController.create({
      message: `Acabas de seguir a ${empresa.nombre}`,
      duration: 2000
    });
    toast.present();
  }



  async mostrarFiltros() {
    const modal = await this.modalControler.create({
      component: FiltrosPage,
      componentProps: {
        empresas: this.empresas,
      }
    });
    modal.onDidDismiss().then(
      (data) => {
        this.filtrarEmpresas(data.data);

      }
    );
    return await modal.present();
  }


  filtrarEmpresas(filtros: any[]) {
    this.distancia = false;
    this.sector = false;
    this.empresasFiltradasDistancia = this.empresas;
    this.empresasFiltradasSectores = this.empresas;
    for (const filtro of filtros) {
      if (filtro.filtro === 'distancia') {
        this.distancia = true;
        this.filtrarPorDistancia(filtro.valor);
      }
      if (filtro.filtro === 'sector') {
        this.sector = true;
        this.filtrarPorSector(filtro.valor);
      }

    }

    this.interseccionFiltros();

  }

  filtrarPorDistancia(distancia: number) {
    this.empresasFiltradasDistancia = [];
    for (const empresa of this.empresas) {
      if (distancia >= this.distanceInKmBetweenEarthCoordinates(this.latitud, this.longitud, empresa.latitud, empresa.longitud)) {
        this.empresasFiltradasDistancia.push(empresa);
      }
    }
  }

  filtrarPorSector(sector: string) {
    this.empresasFiltradasSectores = [];
    for (const empresa of this.empresas) {
      if (sector.trimLeft().trimRight() === empresa.sector.trimLeft().trimRight()) {
        this.empresasFiltradasSectores.push(empresa);
      }
    }
  }

  interseccionFiltros() {
    this.empresasFiltradas = [];

    for (const empresa1 of this.empresasFiltradasDistancia) {
      for (const empresa2 of this.empresasFiltradasSectores) {
        if (empresa1.id === empresa2.id) {
          this.empresasFiltradas.push(empresa1);
        }
      }
    }
  }


  quitarFiltroDistancia() {
    this.distancia = false;
    this.empresasFiltradasDistancia = this.empresas;
    this.interseccionFiltros();
  }

  quitarFiltroSector() {
    this.sector = false;
    this.empresasFiltradasSectores = this.empresas;
    this.interseccionFiltros();
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

  async setPosicion() {
    const rta = await this.location.getCurrentPosition();
    this.latitud = rta.coords.latitude;
    this.longitud = rta.coords.longitude;
  }

}






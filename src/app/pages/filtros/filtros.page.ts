import { Component, OnInit, Input } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
import { SectoresService } from '../../services/sectores.service';
import { ModalController } from '@ionic/angular';


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

  constructor(private secotresService: SectoresService, public modalController: ModalController) { }

  ngOnInit() {
    this.getSectores();
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
    let filtroSector = false;
    let filtroDistancia = false;

    if (this.distancia !== 101) {
      filtroDistancia = true;
    }

    if (this.sector !== '') {
      filtroSector = true;
    }

    if (filtroSector && filtroDistancia) {
      const pasar: any[] = [{ filtro: 'distancia', valor: this.distancia }, { filtro: 'sector', valor: this.sector }];
      this.modalController.dismiss(pasar);
    } else if (filtroSector) {
      const pasar: any[] = [{ filtro: 'sector', valor: this.sector }];
      this.modalController.dismiss(pasar);
    } else if (filtroDistancia) {
      const pasar: any[] = [{ filtro: 'distancia', valor: this.distancia }];
      this.modalController.dismiss(pasar);
    }
    this.modalController.dismiss();



  }
  pulsadoCancelar() {
    this.modalController.dismiss(this.empresas);
  }




}

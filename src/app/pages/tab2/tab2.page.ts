import { Component } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { ToastController, ModalController } from '@ionic/angular';
import { FiltrosPage } from '../filtros/filtros.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  empresas: Empresa[];
  empresasFiltradas: Empresa[];

  constructor(public toastController: ToastController,
    private authService: AuthService, private empresasService:
      EmpresaService, private usuarioService: UsuarioService,
    public modalControler: ModalController) {
    this.recuperarEmpresas();
  }

  recuperarEmpresas() {
    this.empresasService.recuperarEmpresas().subscribe(
      (acc) => {
        this.empresas = acc;
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
        this.empresasFiltradas = data.data;
        console.log(data.data);
      }
    );
    return await modal.present();
  }

}

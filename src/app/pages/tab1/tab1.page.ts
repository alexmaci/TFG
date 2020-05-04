import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmpresasPrivadasService } from '../../services/empresas-privadas.service';
import { EmpresaNueva } from '../../models/empresaNueva.model';
import { UsuarioService } from '../../services/usuario.service';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { storage } from 'firebase';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  empresasPrivadas: EmpresaNueva[];
  empresas: Empresa[];
  mostrar = 'privadas';

  constructor(private empresaService: EmpresaService, private router: Router,
    private auth: AuthService, public srvcEmpresaPrivada: EmpresasPrivadasService,
    private userService: UsuarioService, public toastController: ToastController) {
    this.empresasPrivadas = [];
    this.empresas = [];
    this.getEmpresasPrivadas();
    this.getEmpresas();



  }

  ionViewDidLoad() {

  }


  empresaSeleccionada(empresa: string) {
    console.log(empresa);
  }

  borrar(idEmpresa: string) {
    this.srvcEmpresaPrivada.borrarEmpresa(idEmpresa);
  }

  editar(empresa: string) {
    console.log(empresa);
  }


  agregarEmpresa() {
    this.router.navigateByUrl('/tabs/tab1/nuevaEmpresa');
  }

  getEmpresasPrivadas() {
    console.log(this.auth.recuperarToken());
    this.srvcEmpresaPrivada.getEmpresas(this.auth.recuperarToken()).subscribe(
      (response) => {
        this.empresasPrivadas = response;
      }, (error) => {
        console.log(error);
      }
    );
  }
  getEmpresas() {
    this.userService.recuperarEmpresas(this.auth.recuperarToken()).subscribe(
      (acc) => {
        this.empresas = [];
        for (const id of acc) {
          this.empresaService.recuperarEmpresa(id.empresa).subscribe(
            (ele) => {
              this.empresas.push(ele);
            },
            (rej2) => {
              console.log(rej2);
            }
          );
        }
      }, (rej) => {
        console.log(rej);
      }
    );
  }

  dejarSeguir(empresaPos: number) {

    const empresa = this.empresas[empresaPos];
    this.userService.borrarEmpresa(this.auth.recuperarToken(), empresa.id);
    this.presentToast(empresa);

  }

  async presentToast(empresa: Empresa) {
    const toast = await this.toastController.create({
      message: `Acabas de seguir a ${empresa.nombre}`,
      duration: 2000,
    });
    toast.present();
  }

  cambio() {
    console.log(this.mostrar);
  }








}

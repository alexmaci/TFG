import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SectoresService } from 'src/app/services/sectores.service';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from 'src/app/models/empresa.model';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';
import { AlertController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.page.html',
  styleUrls: ['./nuevo-usuario.page.scss'],
})
export class NuevoUsuarioPage implements OnInit {

  esEmpresa: boolean;
  form: FormGroup;
  sectores: any[];
  empresa: Empresa;
  marker: any;
  img = 'assets/img/placeholder.png';

  constructor(private alertController: AlertController, private cam: Camera, private location: Geolocation, private empresaService: EmpresaService, private router: Router, private auth: AuthService, private usua: UsuarioService, private fb: FormBuilder, private sectoresService: SectoresService) {
    this.getSectores();
    this.crearFormulario();
  }

  ngOnInit() {
    this.loadMap()
  }

  crearFormulario() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      nombre: ['', [Validators.required]],
      comentarios: [],
      sector: ['', [Validators.required]]
    });
  }



  getSectores() {
    this.sectoresService.getSectores().subscribe(
      (acc) => { this.sectores = acc; },
      (rej) => console.log(rej)
    );
  }

  guardarUsuario() {
    this.usua.guardarUsuario(this.auth.recuperarToken());
    this.router.navigateByUrl('/tabs/tab1');
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirma el registro',
      message: 'Se va a proceder al registro de la empresa con la localización marcada en el mapa. ¿Estas seguro que es ese el lugar que quieres marcar como localización de tu empresa?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Aceptar',
          handler: () => {
            this.guardarEmpresa();
          }
        }
      ]
    });
    await alert.present();
  }

  guardarEmpresa() {

    if (this.form.valid) {
      this.empresa = new Empresa();
      this.empresa.img = null;
      if (this.img !== 'assets/img/placeholder.png') {
        const id = new Date().valueOf().toString();
        this.guardarImagen(id);
        this.empresa.img = id;
      }
      this.empresa.nombre = this.form.get('nombre').value;
      this.empresa.email = this.form.get('email').value;
      this.empresa.latitud = this.marker.getPosition().lat();
      this.empresa.longitud = this.marker.getPosition().lng();
      this.empresa.comentarios = this.form.get('comentarios').value;
      this.empresa.sector = this.form.get('sector').value;
      this.guardarUsuario();
      this.empresaService.guardarEmpresa(this.empresa);
    }
  }


  async loadMap() {
    const rta = await this.location.getCurrentPosition();
    const coord = {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };

    const mapOptions = {
      zoom: 12,
      center: coord
    };

    const mapEle: HTMLElement = document.getElementById('map');
    const map = new google.maps.Map(mapEle, mapOptions);

    this.marker = new google.maps.Marker({
      position: coord,
      map,
      draggable: true,
      title: 'drag me!!!'
    });
  }

  async galeria() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.cam.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.cam.DestinationType.DATA_URL,
      encodingType: this.cam.EncodingType.JPEG,
      mediaType: this.cam.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 600,
      targetWidth: 600
    };

    const res = await this.cam.getPicture(options).then();
    this.img = `data:image/jpeg;base64,${res}`;
  }

  async tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.cam.DestinationType.DATA_URL,
      encodingType: this.cam.EncodingType.JPEG,
      mediaType: this.cam.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 600,
      targetWidth: 600
    };

    const res = await this.cam.getPicture(options).then();
    this.img = `data:image/jpeg;base64,${res}`;
  }

  guardarImagen(url: string) {
    const pictures = storage().ref(url);
    pictures.putString(this.img, 'data_url');
  }






}

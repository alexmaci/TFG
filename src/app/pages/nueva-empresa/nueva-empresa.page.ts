import { Component, OnInit } from '@angular/core';
import { EmpresaNueva } from '../../models/empresaNueva.model';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmpresasPrivadasService } from '../../services/empresas-privadas.service';
import { SectoresService } from '../../services/sectores.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';


declare var google;


@Component({
  selector: 'app-nueva-empresa',
  templateUrl: './nueva-empresa.page.html',
  styleUrls: ['./nueva-empresa.page.scss'],
})
export class NuevaEmpresaPage implements OnInit {

  empresa: EmpresaNueva;
  form: FormGroup;
  sectores: any[];
  marker: any;
  guardarPosicion: boolean;
  img = 'assets/img/placeholder.png';

  constructor(private auth: AuthService, private fb: FormBuilder,
    private alertCtrl: AlertController, private router: Router,
    private srvcEmpresaPrivada: EmpresasPrivadasService,
    private sectoresService: SectoresService,
    private location: Geolocation, private cam: Camera) {
    this.getSectores();
    this.crearFormulario();

  }

  ngOnInit() {
    this.loadMap();
  }

  crearFormulario() {
    this.form = this.fb.group({
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      nombre: ['', [Validators.required]],
      comentarios: [],
      sector: ['', []]
    });
  }

  guardar() {
    if (this.form.valid) {

      this.empresa = new EmpresaNueva();
      if (this.img !== 'assets/img/placeholder.png') {
        const id = new Date().valueOf().toString();
        this.guardarImagen(id);
        this.empresa.imagen = id;
      }
      this.empresa.nombre = this.form.get('nombre').value;
      this.empresa.email = this.form.get('email').value;
      this.empresa.latitud = this.marker.getPosition().lat();
      this.empresa.longitud = this.marker.getPosition().lng();
      this.empresa.comentarios = this.form.get('comentarios').value;
      this.empresa.usuario = this.auth.recuperarToken();
      this.empresa.sector = this.form.get('sector').value;
      this.srvcEmpresaPrivada.addEmpresa(this.empresa);
      this.router.navigateByUrl('/tabs/tab1');
    } else {
      this.crearAlerta();
      return;
    }
  }

  getSectores() {
    this.sectoresService.getSectores().subscribe(
      (acc) => { this.sectores = acc; },
      (rej) => console.log(rej)
    );
  }

  async crearAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: 'El formulario es incorrecto',
      buttons: ['OK']
    });

    await alert.present();
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

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    this.marker = new google.maps.Marker({
      position: coord,
      map,
      draggable: true,
      title: 'drag me!!!'
    });
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

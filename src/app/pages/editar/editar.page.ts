import { Component, OnInit, Input } from '@angular/core';
import { EmpresaNueva } from '../../models/empresaNueva.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectoresService } from 'src/app/services/sectores.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { storage } from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasPrivadasService } from '../../services/empresas-privadas.service';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';


declare var google;

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  empresa: EmpresaNueva;
  form: FormGroup;
  sectores: any[];
  imagen: string;
  marker: any;


  constructor(private location: Geolocation, private alertCtrl: AlertController, private router: Router, private fb: FormBuilder, private sectoresService: SectoresService, private cam: Camera, private route: ActivatedRoute, private empresaService: EmpresasPrivadasService) {
    this.crearFormulario();
    this.getSectores();
    this.getEmpresa();




  }

  getEmpresa() {
    this.route.params.subscribe(
      (datos) => {
        this.empresaService.getEmpresa(datos.id).subscribe(
          (data) => {
            this.empresa = data;

            this.cargarValores(this.empresa);
            this.cargarImagen();
            this.loadMap();
          }
        );
      }
    );


  }

  ngOnInit() {

  }

  cargarValores(empresa: EmpresaNueva) {
    this.form.patchValue({
      nombre: empresa.nombre,
      email: empresa.email,
      comentarios: empresa.comentarios,
      sector: empresa.sector,
    });
  }

  getSectores() {
    this.sectoresService.getSectores().subscribe(
      (acc) => { this.sectores = acc; },
      (rej) => console.log(rej)
    );
  }


  crearFormulario() {
    this.form = this.fb.group({
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      nombre: ['', [Validators.required]],
      comentarios: [''],
      sector: ['', []]
    });
  }

  guardar() {
    if (this.form.valid) {
      this.empresa.nombre = this.form.get('nombre').value;
      this.empresa.email = this.form.get('email').value;
      this.empresa.latitud = this.marker.getPosition().lat();
      this.empresa.longitud = this.marker.getPosition().lng();
      this.empresa.comentarios = this.form.get('comentarios').value;
      this.empresa.sector = this.form.get('sector').value;
      this.empresaService.updateEmpresa(this.empresa);
      this.router.navigateByUrl('/tabs/tab1');
    } else {
      this.crearAlerta();
      return;
    }
  }

  async crearAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: 'El formulario es incorrecto',
      buttons: ['OK']
    });

    await alert.present();
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
    this.imagen = `data:image/jpeg;base64,${res}`;
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
    this.imagen = `data:image/jpeg;base64,${res}`;
  }

  guardarImagen(url: string) {
    const pictures = storage().ref(url);
    pictures.putString(this.imagen, 'data_url');
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

  async loadMap() {
    console.log('1');
    const coord = {
      lat: this.empresa.latitud,
      lng: this.empresa.longitud
    };
    console.log('1');
    const mapOptions = {
      zoom: 12,
      center: coord
    };
    console.log('1');
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    console.log(map);
    this.marker = new google.maps.Marker({
      position: coord,
      map,
      draggable: true,
      title: 'drag me!!!'
    });
    console.log(this.marker);
  }

}

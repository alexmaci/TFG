import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private alertCtrl: AlertController, private router: Router) {
    this.crearFormulario();
  }

  ngOnInit() {
  }

  navegarLogin() {
    this.router.navigateByUrl('/login');
  }

  crearFormulario() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      pass: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  guardar() {
    if (this.form.invalid) {
      if (this.form.get('email').errors) {
        this.crearAlerta('Por favor introduzca un correo electronico valido');
      } else {
        this.crearAlerta('La contraseña tiene que tener al menos 8 caracteres');
      }
    } else {
      this.auth.registrar(this.form.get('email').value, this.form.get('pass').value).then(
        res => {
          this.router.navigateByUrl('/nuevo-usuario');
        },
        err => { this.crearAlerta(err.message); }
      );
    }
  }

  async crearAlerta(error) {
    const alert = await this.alertCtrl.create({
      header: 'Registro Incorrecto',
      subHeader: 'El formulario es incorrecto',
      message: error,
      buttons: ['OK']
    });

    await alert.present();
  }

}

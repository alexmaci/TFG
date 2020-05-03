import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder, private alertCtrl: AlertController, private router: Router, private usua: UsuarioService) {
    this.crearFormulario();
  }

  ngOnInit() {
  }

  navegarRegistro() {
    this.router.navigateByUrl('/register');
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
      this.auth.loginUser(this.form.get('email').value, this.form.get('pass').value).then(
        res => {
          this.usuarioExiste().subscribe(
            (acc) => {
              if (acc.exists) {
                this.router.navigateByUrl('/tabs/tab1');
              } else {
                this.router.navigateByUrl('/nuevo-usuario');
              }
            },
            (rej => console.log(rej))
          );
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


  usuarioExiste() {

    return this.usua.estaRegistrado(this.auth.recuperarToken());



  }

}

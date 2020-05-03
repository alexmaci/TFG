import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private auth: AuthService, private router: Router, private usua: UsuarioService) { }

  logOut() {
    this.auth.logout();
    this.router.navigateByUrl('');
  }


}

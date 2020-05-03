import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFirestore) { }

  estaRegistrado(id: string) {
    return this.db.collection('usuarios').doc(id).get();
  }

  guardarUsuario(id: string) {
    this.db.collection('/usuarios').doc(id).set({
      usuario: id
    });
  }

  guardarEmpresa(idUsuario: string, idEmpresa: string) {
    this.db.collection('/usuarios').doc(idUsuario).collection('empresas').doc(idEmpresa).set({ empresa: idEmpresa });
  }

  recuperarEmpresas(idUsuario) {
    return this.db.collection('/usuarios').doc(idUsuario).collection('empresas').valueChanges();
  }

  borrarEmpresa(idUsuario: string, idEmpresa: string) {
    this.db.collection('/usuarios').doc(idUsuario).collection('empresas').doc(idEmpresa).delete();
  }


}

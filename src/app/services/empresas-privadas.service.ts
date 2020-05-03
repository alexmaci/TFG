import { Injectable } from '@angular/core';
import { EmpresaNueva } from '../models/empresaNueva.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class EmpresasPrivadasService {


  constructor(private db: AngularFirestore) {
  }

  addEmpresa(empresa: EmpresaNueva) {
    const idGenerada = this.db.createId();
    return new Promise<any>((resolve, reject) => {
      this.db.collection('/empresasPrivadas').doc(idGenerada).set({
        nombre: empresa.nombre,
        email: empresa.email,
        comentarios: empresa.comentarios,
        latitud: empresa.latitud,
        longitud: empresa.longitud,
        usuario: empresa.usuario,
        id: idGenerada,
        sector: empresa.sector,
        imagen: empresa.imagen
      }).then(
        (res) => resolve(res),
        (err) => resolve(err)
      );
    });
  }

  getEmpresas(usuarioId: string) {
    return this.db.collection<EmpresaNueva>('/empresasPrivadas', ref => ref.where('usuario', '==', usuarioId)).valueChanges();
  }

  borrarEmpresa(id: string) {
    this.db.collection('empresasPrivadas').doc(id).delete();
  }

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Empresa } from '../models/empresa.model';



@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(private db: AngularFirestore) { }

  guardarEmpresa(empresa: Empresa) {
    const idGenerada = this.db.createId();
    this.db.collection('empresas').doc(idGenerada).set({
      nombre: empresa.nombre,
      email: empresa.email,
      comentarios: empresa.comentarios,
      latitud: empresa.latitud,
      longitud: empresa.longitud,
      id: idGenerada,
      sector: empresa.sector,
      imagen: empresa.img
    });
  }

  recuperarEmpresas() {
    return this.db.collection<Empresa>('empresas').valueChanges();
  }

  recuperarEmpresa(idEmpresa: string) {
    return this.db.collection('empresas').doc<Empresa>(idEmpresa).valueChanges();
  }
}

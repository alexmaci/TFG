import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SectoresService {

  constructor(private db: AngularFirestore) { }

  getSectores() {
    return this.db.collection('/sectores').valueChanges();
  }
}

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyAAUdwlT0G5TpKhAHHNJ-leCAuaHYnoVis';

  token: string;

  constructor() {
    this.recuperarToken();
  }

  estaAutenticado() {
    return this.token != null;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    firebase.auth().signOut();
  }
  registrar(usuario: string, pass: string) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(usuario, pass)
        .then(
          res => {
            this.guardarToken(res.user.uid);
            resolve(res);
          },
          err => reject(err));
    });
  }

  loginUser(usuario: string, pass: string) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(usuario, pass)
        .then(
          res => {
            this.guardarToken(res.user.uid);
            resolve(res);
          },
          err => reject(err));
    });
  }

  private guardarToken(idToken: string) {
    this.token = idToken;
    localStorage.setItem('token', idToken);
  }

  recuperarToken() {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  userDetails() {
    return firebase.auth().currentUser;
  }




}

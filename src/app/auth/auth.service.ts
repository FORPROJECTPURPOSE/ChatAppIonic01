import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    reMessageAuth: any;

  constructor(private afAuth: AngularFireAuth) { }

  public login(email, password) {
      return  this.afAuth.auth.signInWithEmailAndPassword(email, password);
      //     .then(res => {
      //       console.log('On Success', res);
      //     })
      //     .catch(error => {
      //       console.log('On Error', error);
      //     }
      // );
  }
}

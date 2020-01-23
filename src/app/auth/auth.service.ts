import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    reMessageAuth: any;

  constructor(private afAuth: AngularFireAuth) { }

  public login(PHONENUMBER) {
      return  this.afAuth.auth.signInWithPhoneNumber(PHONENUMBER);
      //     .then(res => {
      //       console.log('On Success', res);
      //     })
      //     .catch(error => {
      //       console.log('On Error', error);
      //     }
      // );
  }
}

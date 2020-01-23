import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {WindowService} from './window.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phone: any;
  password: any;
  public resMessage: any;
  public name: any;
  private loading: any;
  private authState: any;
  private isPhoneNumberAvailable: boolean;
  windowRef: any;
  verificationCode: string;
  private user: any;
  private showLogin = false;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              public toastController: ToastController,
              private router: Router,
              public loadingCtrl: LoadingController,
              private firebaseAuth: AngularFireAuth,
              private win: WindowService) {

  }

  ngOnInit() {
    this.isPhoneNumberAvailable = false;
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaVerifier.render();
  }

  login() {

    if (this.phone == null) {
      this.presentToast('Fill in the details!');
      return;
    } else {

      const appVerifier = this.windowRef.recaptchaVerifier;

      const num = this.phone;

      firebase.auth().signInWithPhoneNumber(num, appVerifier)
          .then(result => {

            this.windowRef.confirmationResult = result;
            console.log(result);
            this.showLogin = true;

          })
          .catch( error => {
            console.log(error);
          } );
    }
  }

  verifyLoginCode() {
    if (this.verificationCode === null) {
      this.presentToast('Please inserte Verification Code');
    }
    this.windowRef.confirmationResult
        .confirm(this.verificationCode)
        .then( result => {

          this.user = result.user;

        })
        .catch( error => console.log(error, 'Incorrect code entered?'));
  }

  async presentToast(MESSAGE) {
    const toast = await this.toastController.create({
      message: MESSAGE,
      duration: 3000
    });
    toast.present();
  }

  // async presentLoadingCustom() {
  //   const loading = await this.loading.create({
  //     message: 'Please wait!',
  //     spinner: 'circles'
  //   });
  //   await loading.present();
  // }


  public userData(): any {
    console.log(this.authState.uid);
    /*[
      {
        id: this.authState.uid,
        displayName: this.authState.displayName,
        email: this.authState.email,
        phoneNumber: this.authState.phoneNumber,
        photoURL: this.authState.photoURL,
      }
    ];*/
  }

}

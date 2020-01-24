import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {LoadingController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {WindowService} from './window.service';
import {CoreService} from '../services/core.service';
import * as uuid from 'uuid';

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
  private tocken: any;


  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              public toastController: ToastController,
              private router: Router,
              public loadingCtrl: LoadingController,
              private firebaseAuth: AngularFireAuth,
              private win: WindowService,
              private core: CoreService) {

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

  async verifyLoginCode() {
    if (this.verificationCode === null) {
      this.presentToast('Please insert Verification Code');
    } else {

      this.windowRef.confirmationResult
          .confirm(this.verificationCode)
          .then(result => {

            this.user = result.user;
            // this.router.navigate(['/home']);
          })
          .catch(error => {
            console.log(error);
            this.presentToast(error.MESSAGE);
          });

      try {
        await this.core.checkPhoneNumber(this.phone)
            .subscribe(res => {
              console.log('dsdsda' + res);

              if (Object.keys(res).length === 0) {
                this.presentToast('User Not Found!');
                console.log('in ifffffffffffffffffffffffff');
                throw new Error();
              } else {
                console.log('in ELSE EEEEEEEEEE');
                this.tocken = firebase.auth().currentUser.refreshToken;
                const myId = uuid.v4();
                console.log('ssssssss' + myId + '    ' + this.tocken + ' ');

                this.core.sendAdminToken(this.phone, this.tocken, myId);

                this.router.navigate(['/home']);
              }
            });

          } catch (e) {
            this.presentToast('User Not Found!');
          }
    }

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

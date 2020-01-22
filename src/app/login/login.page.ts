import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: any;
  password: any;
  public resMessage: any;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              public toastController: ToastController,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (this.email == null || this.password == null) {
      this.presentToast('Fill in the details!');
      return;
    }
    this.auth.login(this.email, this.password)
        .then(res => {
          console.log('aaaaaaaaaaa' + res);
          this.router.navigate(['/home']);
          this.presentToast(res);
        }).catch(errorr => {
          console.log('gggggggggggggg' + errorr);
          this.resMessage = errorr;
          this.presentToast(errorr);
    });
  }

  async presentToast(MESSAGE) {
    const toast = await this.toastController.create({
      message: MESSAGE,
      duration: 3000
    });
    toast.present();
  }


}

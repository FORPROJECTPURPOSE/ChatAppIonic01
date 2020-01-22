import {Component, Input, OnInit} from '@angular/core';
import {NavParams, PopoverController} from "@ionic/angular";
import {CoreService} from "../../../../services/core.service";

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  constructor(private navParams: NavParams,
              private popoverCtrl: PopoverController,
              private core: CoreService) {
    console.log(this.navParams.data);
  }

  ngOnInit() {}
    closeTicket() {
    const DATA: any = this.navParams.data;
    this.core.closeChatUpdate(DATA.userId, DATA.ticketId)
        .then(() => {
          this.core.presentToast('Ticket Closed Successfully').then();
        })
    }

}

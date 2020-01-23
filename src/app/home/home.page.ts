import {Component, OnInit} from '@angular/core';
import {CoreService} from '../services/core.service';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  Users: any[];

  constructor(private core: CoreService,
              private popoverController: PopoverController) {}

  ngOnInit(): void {
    this.getActiveUsers();
  }

  getActiveUsers() {
    this.core.getActiveTickets()
        .subscribe(data => {
          this.Users = data;
          for (const user of this.Users) {
            this.core.getUserActiveTicketsCount(user.id, 'active').subscribe(tickets => {
              console.log(tickets);
              user.activeCount = tickets.docs.length;
            });
            this.core.getUserActiveTicketsCount(user.id, 'closed').subscribe(tickets => {
              user.closedCount = tickets.docs.length;
            });
          }
        });
  }

  // async openTopMenu(ev: any) {
  //   const popover = await this.popoverController.create({
  //     component: TopMenuComponent2,
  //     componentProps: {
  //       userId: this.UserId
  //     },
  //     event: ev,
  //     translucent: true
  //   });
  //   return await popover.present();
  // }

}

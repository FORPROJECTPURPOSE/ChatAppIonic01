import {Component, OnInit} from '@angular/core';
import {CoreService} from "../services/core.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  Users: any[];

  constructor(private core: CoreService) {}

  ngOnInit(): void {
    this.getActiveUsers();
  }

  getActiveUsers() {
    this.core.getActiveTickets()
        .subscribe(data => {
          this.Users = data;
          for (let user of this.Users) {
            this.core.getUserActiveTicketsCount(user.id, 'active').subscribe(tickets => {
              console.log(tickets);
              user.activeCount = tickets.docs.length;
            });
            this.core.getUserActiveTicketsCount(user.id, 'closed').subscribe(tickets => {
              user.closedCount = tickets.docs.length;
            });
          }
        })
  }

}

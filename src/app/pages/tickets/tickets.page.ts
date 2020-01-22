import { Component, OnInit } from '@angular/core';
import {CoreService} from "../../services/core.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  Tickets: any[];

  constructor(private core: CoreService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getTickets(params.uid);
    })
  }
  getTickets(U_ID) {
    this.core.getUserTickets(U_ID).subscribe(tickets => {
      this.Tickets = tickets;
      for (let t of this.Tickets) {
        this.core.getLastMessage(U_ID, t.id)
            .subscribe(msg => {
              console.log(msg);
              t.lastMessage = msg[0]
            })
      }
    })
  }

}

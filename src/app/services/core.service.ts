import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ToastController} from '@ionic/angular';
import actions from "@angular/fire/schematics/deploy/actions";

const API_URL = 'http://173.82.72.107/support/support.cfc?method=';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private db: AngularFirestore,
              private toastCtrl: ToastController,
              private http: HttpClient) { }

 public checkPhoneNumber(PHONENUMBER) {
     console.log('FFFFFFFFFFFFFFFFFF' + PHONENUMBER);

     return this.db.collection('Admins', ref => ref.where('Phone', '==', PHONENUMBER))
          .snapshotChanges()
          .pipe(map(action => action.map(a => {
              const DATA: any = a.payload.doc.data();
              DATA.id = a.payload.doc.id;
              console.log('FFFFFFFFFFFFFFFFFF' + DATA);
              return DATA;
          })));

 }

 public getPreDefinesMessages() {
    return this.db.collection('pre-defined-messages')
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => {
          const DATA: any = a.payload.doc.data();
          DATA.id = a.payload.doc.id;
          return DATA;
        })));
  }

  public getActiveTickets() {
    return this.db.collection('support-chat', ref => ref.where('status', '==', 'active'))
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => {
          const DATA: any = a.payload.doc.data();
          DATA.id = a.payload.doc.id;
          return DATA;
        })));
  }
  public getLastMessage(USER_ID, TICKET_ID) {
      return this.db.collection(`support-chat/${USER_ID}/tickets/${TICKET_ID}/messages`,
              ref => ref.orderBy('timeStamp', 'desc')
                  .limit(1))
          .snapshotChanges()
          .pipe(map(actions => actions.map(a => {
              const DATA: any = a.payload.doc.data();
              DATA.id = a.payload.doc.id;
              return DATA;
          })));
  }
  public getUserActiveTicketsCount(USER_ID, STATUS) {
      return this.db.collection(`support-chat/${USER_ID}/tickets`,
              ref => ref.where('status', '==', STATUS)).get();
  }
  public getUserTickets(USER_ID) {
    return this.db.collection(`support-chat/${USER_ID}/tickets`)
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => {
          const DATA: any = a.payload.doc.data();
          DATA.id = a.payload.doc.id;
          DATA.uid = USER_ID;
          return DATA;
        })));
  }
  public getTicketMessages(USER_ID, TICKET_ID) {
    return this.db.collection(`support-chat/${USER_ID}/tickets/${TICKET_ID}/messages`, ref => ref.orderBy('timeStamp', 'asc'))
        .snapshotChanges()
        .pipe(map(actions => actions.map(a => {
          const DATA: any = a.payload.doc.data();
          DATA.id = a.payload.doc.id;
          return DATA;
        })));
  }
  public addMessage(USER_ID, TICKET_ID, DATA) {
      this.db.collection(`support-chat/${USER_ID}/tickets/${TICKET_ID}/messages`)
          .add(DATA).then();
  }
  public closeChatUpdate(USER_ID, TICKET_ID) {
      return this.db.doc(`support-chat/${USER_ID}/tickets/${TICKET_ID}`)
          .update({status: 'closed'});
  }
  // API SERVICES
  public sendMessagePush(USERNAME, SUBJECT, MESSAGE, TICKET_ID) {
      return this.http.get(`${API_URL}admin&returnformat=json&username=${USERNAME}&uuid=${'e383630bbf5d8eae'}&sub=${SUBJECT}&text=${MESSAGE}&to=94777552555&status=0&tid=${TICKET_ID}`);
  }
  // CLOSE TICKET
  public closeTicketUpdate(USERNAME, SUBJECT, MESSAGE, TICKET_ID) {
      return this.http.get(`${API_URL}admin&returnformat=json&username=${USERNAME}&uuid=e383630bbf5d8eae&sub=${SUBJECT}&text=${MESSAGE}&to=94777552555&status=1 `);
  }
  // SEND TOKEN
  public sendAdminToken(USERNAME, TOKEN, UUID) {
      console.log(`aaaaaaaaaaaaaaaaaaa https://rest2.vnserv.com/support/admin.cfc?method=admintoken&returnformat=json&username=${USERNAME}&uuid=${UUID}&token=${TOKEN}`);
      return this.http.get(`https://rest2.vnserv.com/support/admin.cfc?method=admintoken&returnformat=json&username=${USERNAME}&uuid=${UUID}&token=${TOKEN}`);
  }
  // TOAST
  async presentToast(MSG) {
      const toast = await this.toastCtrl.create({
          message: MSG,
          duration: 3000
      });
      await toast.present();
  }
}

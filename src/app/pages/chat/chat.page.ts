import {Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {CoreService} from "../../services/core.service";
import {ActivatedRoute} from "@angular/router";
import {AngularFirestoreCollection} from "@angular/fire/firestore";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {FormControl, FormGroup} from "@angular/forms";
import {IonList, IonContent, PopoverController, Platform} from "@ionic/angular";
import {Observable} from "rxjs";
import {TopMenuComponent} from "./components/top-menu/top-menu.component";
import {finalize, tap} from "rxjs/operators";
import * as moment from "moment";

export interface ChatData {
  name: string;
  imgName: string;
  type: string;
  imageURL: string;
  readStatus: number;
  // size: number;
  timestamp: any;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  animations: [

  ]
})
export class ChatPage implements OnInit {
  Messages: any[];
  TicketId: string;
  UserId: string;
  Subject: string;

  chatForm = new FormGroup({
    chatInput: new FormControl()
  });
  chatArray = [];
  @ViewChild(IonContent, {static: true}) contentArea: IonContent;
  @ViewChild(IonList, {static: true, read: ElementRef}) chatList: ElementRef;

  // Image Upload
  // Upload Task
  task: AngularFireUploadTask;
  // Progress in percentage
  percentage: Observable<number>;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  //Uploaded Image List
  images: Observable<ChatData[]>;
  //File details
  fileName:string;
  fileSize:number;

  //Status check
  isUploading:boolean;
  isUploaded:boolean;

  private mutationObserver: MutationObserver;
  private query: AngularFirestoreCollection<unknown>;
  private username: string;
  public userImg = localStorage.getItem('userProfileImg'); // 'akila | madhavee'
  private sending: boolean;
  PreDefined: any;

  slideOptions = {
    slidesPerView: 2.5
  };
  animate: boolean;
  constructor(private core: CoreService,
              private storage: AngularFireStorage,
              private platform: Platform,
              private popoverController: PopoverController,
              private route: ActivatedRoute) {
    if (!platform.is('android')) {
      this.slideOptions = {
        slidesPerView: 7.5
      };
    }
    this.chatForm.controls.chatInput.valueChanges.subscribe(val => {
      if (val.length > 1) {
        this.animate = true;
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getMessages(params.uid, params.ticketId);
      // this.getTickets(params.uid);
      this.TicketId = params.ticketId;
      this.UserId = params.uid;
      this.Subject = params.subject;
    });
    this.scrollEvent();
  }
  //
  scrollEvent() {
    this.mutationObserver = new MutationObserver((mutations) => {
      this.contentArea.scrollToBottom();
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });
  }
  //
  getMessages(USER_ID, TICKET_ID) {
    this.core.getTicketMessages(USER_ID, TICKET_ID)
        .subscribe(messages => {
          console.log(messages);
          this.Messages = messages;
        });
    this.getPreDefined();
  }
  // GET PER DEFINED MESSAGES
  getPreDefined() {
    this.core.getPreDefinesMessages().subscribe(messages => {
      this.PreDefined = messages;
    });
  }
  // OPEN TOP ACTION MENU
  async openTopMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: TopMenuComponent,
      componentProps: {
        ticketId: this.TicketId,
        userId: this.UserId
      },
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
  // TIME FILTER
  filterTimeFromNow(TIME) {
    const _D = TIME.toDate();
    return moment(_D).fromNow();
  }
  // SEND MESSAGES
  async sendMessage() {
    if (this.chatForm.value.chatInput) {
      const DATA = {
        message: this.chatForm.value.chatInput,
        name: 'Akila',
        readStatus: 0,
        timeStamp: new Date(),
        type: 'admin'
      };
      await this.core.addMessage(this.UserId, this.TicketId, DATA);
      await this.core.sendMessagePush(this.UserId, 'SUBJECT', DATA.message, this.TicketId).subscribe();
      await this.chatForm.reset();
    }
  }

  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0);
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }
    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = file.name;
    // The storage path
    const path = `chat-images/${new Date().getTime()}_${file.name}`;
    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };
    //File reference
    const fileRef = this.storage.ref(path);
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
        finalize(() => {
          // Get uploaded file storage path
          this.UploadedFileURL = fileRef.getDownloadURL();

          this.UploadedFileURL.subscribe(resp => {
            this.addImageToDB({
              name: 'Akila',
              readStatus: 0,
              type: 'admin',
              imgName: file.name,
              imageURL: resp,
              timestamp: new Date()
            });
            this.isUploading = false;
            this.isUploaded = true;
          },error=>{
            console.error(error);
          })
        }),
        tap(snap => {
          console.log(snap);
          this.fileSize = snap.totalBytes;
        })
    )
  }
  imageLoaded() {

  }

  async addImageToDB(DATA: ChatData) {
    await this.core.addMessage(this.UserId, this.TicketId, DATA);
    await this.core.sendMessagePush(this.UserId, 'SUBJECT', 'Screenshot', this.TicketId).subscribe();
    await this.chatForm.reset();
  }

  setPreDefinedMsg(text: string | (() => Promise<string>) | SVGTextElement) {
    this.chatForm.setValue({
      chatInput: text
    }, {emitEvent: false});
  }
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const FILE_SIZE_UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Pettabytes', 'Exabytes', 'Zettabytes', 'Yottabytes'];

@Pipe({
  name: 'fileSizePipe'
})
export class FileSizeFormatPipe implements PipeTransform {
  static forRoot() {
    throw new Error("Method not implemented.");
  }
  transform(sizeInBytes: number, longForm: boolean): string {
    const units = longForm
        ? FILE_SIZE_UNITS_LONG
        : FILE_SIZE_UNITS;
    let power = Math.round(Math.log(sizeInBytes)/Math.log(1024));
    power = Math.min(power, units.length - 1);
    const size = sizeInBytes / Math.pow(1024, power); // size in new units
    const formattedSize = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit = units[power];
    return `${formattedSize} ${unit}`;
  }
}

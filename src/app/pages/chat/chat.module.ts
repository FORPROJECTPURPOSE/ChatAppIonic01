import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import {ChatPage, FileSizeFormatPipe} from './chat.page';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TopMenuComponent} from './components/top-menu/top-menu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ChatPageRoutingModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule
    ],
  entryComponents: [TopMenuComponent],
  exports: [FileSizeFormatPipe],
  declarations: [ChatPage, TopMenuComponent, FileSizeFormatPipe]
})
export class ChatPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatNewRecipientPage } from './chat-new-recipient';

@NgModule({
  declarations: [
    ChatNewRecipientPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatNewRecipientPage),
  ],
})
export class ChatNewRecipientPageModule {}

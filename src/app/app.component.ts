import { Component, OnInit } from '@angular/core';
import Message from 'src/models/Message';
import { MessageService } from 'src/services/MessageService';
import { MatDialog } from '@angular/material/dialog';
import { NewMessageComponent } from './new-message.component';
import { IMessageService } from 'src/services/IMessageService';
import { DxDataGridComponent } from 'devextreme-angular';
import { ISignalRService } from 'src/services/ISignalRService';
import SignalRService from 'src/services/SignalRService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MessageApp';

  messages: Message[];
  connectionStarted: boolean;
  dataSource = [];

  private messageService: IMessageService;
  private signalRService: ISignalRService;
  private dialog: MatDialog;

  constructor(messageService: MessageService, signalRService: SignalRService, dialog: MatDialog) {
    this.messageService = messageService;
    this.signalRService = signalRService;
    this.dialog = dialog;
    this.connectionStarted = false;
  }

  async ngOnInit() {
    this.messages  = await this.GetAllMessages();
    this.dataSource = this.messages;
    this.ConfigureSignalR();
  }

  viewMessage(event: any)
  {
    var messageData = event.data;

    console.log(messageData as Message);

    var message = new Message();
    message.Id = messageData.id;
    message.Subject = messageData.subject;
    message.Content = messageData.content;
    message.Author = messageData.author;
    message.SentAt = messageData.sentAt;

    this.openDialog(false, message);
  }

  sendNewMessage(event: Event) {
    this.openDialog(true, new Message());
  }

  private openDialog(enabledFields: boolean, messageData: Message)
  {
    const dialogRef = this.dialog.open(NewMessageComponent, {
      width: '40%', 
      data: {message: messageData, enabledFields: enabledFields}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.messageService.SendNewMessage(result).subscribe();
      }
    });
  }

  private async ConfigureSignalR()
  {
    this.signalRService.StartConnection()
      .then(() => 
      {
        console.log("Connection succeeded.")
        this.connectionStarted = true;
        this.signalRService.AddListener("newMessage", (data) => {
          console.log("New Message received") 
          this.messages.push(data)
        });
      })
      .catch(err => console.error("Error starting SignalR connection"));
  }

  private async GetAllMessages() : Promise<Message[]>
  {
    var allMessages = await this.messageService.GetAllMessages();
    return allMessages;
  } 
}

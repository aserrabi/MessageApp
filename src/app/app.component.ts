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
  title = 'IConstituentMessageApp';

  messages: Message[];
  connectionStarted: boolean;
  displayedColumns: string[] = ['id', 'subject', 'content', 'author', 'sentAt'];
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

  private async ConfigureSignalR()
  {
    this.signalRService.StartConnection()
      .then(() => 
      {
        console.log("Connection succeeded.")
        this.connectionStarted = true;
        this.signalRService.AddListener("newMessage", (data) => {
          console.log("New Message received") 
          console.log(data) 
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

  sendNewMessage(event: Event) {
    const dialogRef = this.dialog.open(NewMessageComponent, {
      width: '30%', 
      data: new Message()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.messageService.SendNewMessage(result).subscribe();
    });
  }
}

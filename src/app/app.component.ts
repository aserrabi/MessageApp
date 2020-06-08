import { Component, OnInit, ViewChild } from '@angular/core';
import Message from 'src/models/Message';
import { MessageService } from 'src/services/MessageService';
import { MatDialog } from '@angular/material/dialog';
import { NewMessageComponent } from './new-message.component';
import { IMessageService } from 'src/services/IMessageService';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild("messages-data-grid", { static: false }) dataGrid: DxDataGridComponent
  title = 'IConstituentMessageApp';

  messages: Message[];
  displayedColumns: string[] = ['id', 'subject', 'content', 'author', 'sentAt'];
  dataSource = [];

  private messageService: IMessageService;

  constructor(messageService: MessageService, public dialog: MatDialog) {
    this.messageService = messageService;
  }

  async ngOnInit() {
    this.messages  = await this.GetAllMessages();
    this.dataSource = this.messages;
  }

  private async GetAllMessages() : Promise<Message[]>
  {
    var allMessages = await this.messageService.GetAllMessages();
    return allMessages;
  }

  private AddMessage(message: Message)
  {
    var gridInstance = this.dataGrid.instance;

    gridInstance.on("initNewRow", e => {  
      e.data = message;
    });  
  
    gridInstance.addRow(); 
  }

  sendNewMessage(event: Event) {
    const dialogRef = this.dialog.open(NewMessageComponent, {
      width: '30%', 
      data: new Message()
    });

    dialogRef.afterClosed().subscribe(result => {
      this.messageService.SendNewMessage(result)
            .subscribe(newMessage => 
              {
                this.messages.push(newMessage);
                this.AddMessage(newMessage)

              })
    });
  }
}

import { Component, Inject } from "@angular/core";
import Message from 'src/models/Message';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'new-message.component',
    templateUrl: './new-message.component.html',
    styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent {

    constructor(
        public dialogRef: MatDialogRef<NewMessageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Message) {}

        onCancelClick(): void {
            this.dialogRef.close();
        }

}
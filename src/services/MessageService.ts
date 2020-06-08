import { IMessageService } from './IMessageService';
import Message from 'src/models/Message';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class MessageService implements IMessageService
{
    private apiUrl = "http://localhost:50502/messages";

    constructor(private http: HttpClient) { }

    async GetAllMessages(): Promise<Message[]> {
        var result = await this.http.get<Message[]>(this.apiUrl).toPromise()
        return result;
    }

    SendNewMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, message);
    }
    
}
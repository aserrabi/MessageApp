import Message from 'src/models/Message';
import { Observable } from 'rxjs';

export interface IMessageService
{
    GetAllMessages() : Promise<Array<Message>>
    SendNewMessage(message: Message) : Observable<Message>
}
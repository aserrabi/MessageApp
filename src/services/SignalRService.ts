import { Injectable } from '@angular/core';
import { ISignalRService } from './ISignalRService';
import *  as SignalR from '@aspnet/signalr'

@Injectable(
    {
        providedIn: 'root'
    }
)
export default class SignalRService implements ISignalRService {
    
    hubConnection: SignalR.HubConnection;

    StartConnection(): Promise<void> {
        this.hubConnection = new SignalR.HubConnectionBuilder()
                            .withUrl('http://localhost:50502/messageHub')
                            .build();
 
        return this.hubConnection.start();
    }

    AddListener(method: string, callbackFunction: Function): void {
        this.hubConnection.on(method, (data) => callbackFunction(data));
    }

}
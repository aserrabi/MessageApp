export interface ISignalRService {

    StartConnection(): Promise<void>;
    AddListener(method: string, callbackFunction: Function): void;
}
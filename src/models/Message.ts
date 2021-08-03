export default class Message
{
    Id: Number;
    Subject: String;
    Content: String;
    Author: String;
    SentAt: Date;
    
    constructor()
    {
        this.Id = 0;
        this.Subject = "";
        this.Content = "";
        this.Author = "";
        this.SentAt = new Date();
    }

}
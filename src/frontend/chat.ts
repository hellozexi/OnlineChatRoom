const socket = (window as any).io();

class Chat {
    static io : any;
    constructor(private cb : Function){}
    emmitMessage(message : string) {
        Chat.io.emit('message', message)
    }

}
Chat.io = socket;
function messageReceived(response : any) {}
let chat : Chat = new Chat(messageReceived);

chat.emmitMessage('to server');
function createNewRoom(){
    let message = (<HTMLInputElement>document.getElementById("newRoom")).value;
    if(message == "") {
        return;
    }
    chat.emmitMessage(message);
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom)
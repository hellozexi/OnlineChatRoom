const socket = (window as any).io();

class Chat {
    static io : any;
    constructor(private cb : Function){
        Chat.io.on('messageFromServer', this.cb)
    }
    emmitMessage(message : string) {
        Chat.io.emit('message', message)
    }

}
Chat.io = socket;
function messageReceived(response : any) {
    console.log(response);
    document.getElementById("")
}
let chat : Chat = new Chat(messageReceived);
function createNewRoom(){
    let message = (<HTMLInputElement>document.getElementById("newRoom")).value;
    if(message === "") {
        return;
    }
    document.getElementById("newRoom");
    chat.emmitMessage(message);
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom)
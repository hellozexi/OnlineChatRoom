const socket = (window as any).io();

class Chat {
    static io : any;
    constructor(private msg : string, private cb : Function){
        Chat.io.on(msg, this.cb)
    }
    emmitMessage(message : string) {
        Chat.io.emit('message', message)
    }

}
Chat.io = socket;
function messageReceived(response : any) {
    console.log(response);
    let room = document.createElement("li");
    room.innerText = response.message;
    $("#rooms").append(room);

}
let chat : Chat = new Chat('messageFromServer',messageReceived);
function createNewRoom(){
    let message = (<HTMLInputElement>document.getElementById("newRoom")).value;
    if(message === "") {
        return;
    }
    document.getElementById("newRoom");
    chat.emmitMessage(message);
    $("#newRoom").val("");
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom)
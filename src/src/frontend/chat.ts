const socket = (window as any).io();

socket.on("updateRooms", addRoom);
socket.on("connect", connect);
/**
 * handle messages
 * @param response
 */
function addRoom(response : any) {
   //console.log(response);
    $("#rooms").empty();
    for(let key in response) {
        //console.log(key);
        let room = document.createElement("div");
        let roomName = document.createElement("li");
        roomName.innerText = key;
        room.appendChild(roomName);
        let in_btn = document.createElement("button");
        in_btn.setAttribute("class", "btn btn-primary btn-sm");
        in_btn.innerText = "Get in";
        room.appendChild(in_btn);
        $("#rooms").append(room);
    }



}


/**
 * emmit messages
 */
//when a new user come in, prompt a dialog.
function connect() {
    let message = prompt("Gave yourself a name");
    while(message == "" || message == null) {
        message = prompt("You should have a name!");
    }
    socket.emit("addUser", message);
    //$("#welcome").val("Welcome" + message);
    document.getElementById("welcome").innerText = "Welcome:  " + message;
}
//create new rooms, when you click the button, rooms will show on the webpage
function createNewRoom(){
    let message = (<HTMLInputElement>document.getElementById("newRoom")).value;
    if(message === "") {
        return;
    }
    socket.emit("addRoom", message);
    //console.log(message);
    $("#newRoom").val("");
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom);

//create new message, it can show on the webpage
function createNewMsg() {
    let message = $("#message_input").val();
    if(message === "") {
        return;
    }
    socket.emit("message2", message);
    console.log(message);
    $("#message_input").val("");
}
document.getElementById("msg_button").addEventListener("click", createNewMsg);
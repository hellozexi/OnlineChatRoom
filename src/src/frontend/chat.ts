const socket = (window as any).io();
socket.on("updateRooms", addRoom);
socket.on("connect", connect);
socket.on("currentUsers", showUsers);
//socket.on("userIn", userAction);
//socket.on("userOut", userAction);
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
        in_btn.setAttribute("id", key);
        in_btn.addEventListener("click", (e : Event) => {
            switchRoom(key);
            //console.log(key);
        });
        room.appendChild(in_btn);
        $("#rooms").append(room);
    }
}
function showUsers(response : any) {
    console.log(response);
    $("#users").empty();
    for(let i in response) {
        //console.log(response[user].name);
        let user = document.createElement("div");
        let userName = document.createElement("li");
        userName.innerText = response[i].name;
        user.appendChild(userName);
        //kick if owner of room
        /*let in_btn = document.createElement("button");
        in_btn.setAttribute("class", "btn btn-primary btn-sm");
        in_btn.innerText = "Get in";
        room.appendChild(in_btn);*/
        $("#users").append(user);
    }

}
function userAction(response : any) {
    console.log(response);
    let log = document.createElement("p");
    log.innerText = response;
    $("#chatlog").add(log);
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

function switchRoom(roomName : string) {
    socket.emit("switchRoom", roomName);
    return;
}
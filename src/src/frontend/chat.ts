const socket = (window as any).io();
socket.on("updateRooms", addRoom);
socket.on("updatePrivateRooms", addPrivateRoom)
socket.on("connect", connect);
socket.on("currentUsers", showUsers);
socket.on("public_msg_to_client", showMsg);
socket.on("private_msg_to_client", showMsg);
socket.on("currentRoom", (response : any) => {
    document.getElementById("cur_room").innerText = response;
})
//failed message
socket.on("system", (response : any) => {
    alert(response);
})
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
function addPrivateRoom(response : any) {
    console.log(response);
    $("#rooms_private").empty();
    for(let key in response) {
        console.log(key);
        let room = document.createElement("div");
        let roomName = document.createElement("li");
        roomName.innerText = key + "(private room)";
        room.appendChild(roomName);
        let in_btn = document.createElement("button");
        in_btn.setAttribute("class", "btn btn-primary btn-sm");
        in_btn.innerText = "Get in";
        in_btn.setAttribute("id", key);
        in_btn.addEventListener("click", (e : Event) => {
            let pwd = prompt("enter the password:");
            switchRoom_withPwd(key, pwd);
            //console.log(key);
        });
        room.appendChild(in_btn);
        $("#rooms_private").append(room);
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
        //private communication
       /* let private_btn = document.createElement("a");
        private_btn.innerText = "message";
        private_btn.addEventListener("click", (e : Event) => {
            let msg = prompt("What do you want to say?");
            sendPrivateMsg(response[i].name, msg);
        })*/
        //user.appendChild(private_btn);
        $("#users").append(user);
    }

}
function userAction(response : any) {
    console.log(response);
    let log = document.createElement("p");
    log.innerText = response;
    $("#chatlog").add(log);
}

function showMsg(response : any) {
    //console.log("from server:" + response);
    let msg = document.createElement("p");
    msg.innerText = response;
    $("#chatlog").append(msg);
}
/**
 * emmit messages
 */
function sendPrivateMsg() {
    let user = $("#receiver").val();
    let msg = $("#message").val();
    /*if(user === "")
        alert("input username")
        return;
    if(msg === "")
        alert("input message")
        return;*/
    console.log(user);
    console.log(msg);
    socket.emit("privateMsg", [user, msg]);
    //$("#receiver").val("");
    $("msg").val("");
}
document.getElementById("private_msg_button").addEventListener("click", sendPrivateMsg);

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
    $("#kick_ban").show();
}
function createNewRoom_withPwd() {
    let message = $("#newRoom").val();
    if(message === ""){
        return;
    }
    let pwd = prompt("Set your password:");
    if(pwd === "") {
        alert("input a password")
        return;
    }
    socket.emit("addRoom_withPwd", [message, pwd]);
    $("#newRoom").val("");
    $("#kick_ban").show();
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom);
document.getElementById("newRoom_btn_withPwd").addEventListener("click", createNewRoom_withPwd);
function kick() {
    let who_kicked = $("#kick").val();
    if(who_kicked === "") {
        alert("input user you want to kick out")
        return;
    }
    socket.emit("kick", who_kicked);
    $("#kick").val("");
}

function ban() {
    let who_banned = $("#ban").val();
    if(who_banned === "") {
        alert("input user you want to ban")
        return;
    }
    socket.emit("ban", who_banned);
    $("#ban").val("");
}

document.getElementById("kick_btn").addEventListener("click", kick);
document.getElementById("ban_btn").addEventListener("click", ban);


//create new message, it can show on the webpage
function createNewMsg() {
    let message = $("#message_input").val();
    if(message === "") {
        return;
    }
    socket.emit("public_msg", message);
    console.log(message);
    $("#message_input").val("");
}
document.getElementById("msg_button").addEventListener("click", createNewMsg);

function switchRoom(roomName : string) {
    socket.emit("switchRoom", roomName);
    return;
}

function switchRoom_withPwd(roomName : string, pwd : string) {
    socket.emit("switchRoom_withPwd", [roomName, pwd]);
    return;
}

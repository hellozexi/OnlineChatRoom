const socket = (window as any).io();
socket.on("messageFromServer", messageReceived)

/**
 * handle messages
 * @param response
 */
function messageReceived(response : any) {
    console.log(response);
    let room = document.createElement("li");
    room.innerText = response.message;
    $("#rooms").append(room);

}
/**
 * emmit messages
 */
//create new rooms, when you click the button, rooms will show on the webpage
function createNewRoom(){
    let message = (<HTMLInputElement>document.getElementById("newRoom")).value;
    if(message === "") {
        return;
    }
    document.getElementById("newRoom");
    socket.emit("message", message);
    $("#newRoom").val("");
}
document.getElementById("newRoom_btn").addEventListener("click", createNewRoom);
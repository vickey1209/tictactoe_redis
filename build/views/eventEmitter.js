const sendToSocket = (socket,data)=>{
    console.log(`REQUEST EVENT NAME :${data.eventName}  : REQUEST DATA : ${JSON.stringify(data.data)}`);
    socket.emit(data.eventName,data);
}
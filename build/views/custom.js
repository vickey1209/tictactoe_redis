let socket = io();

let tableId;
var symbol;
let userId;
var turn = true;
let buttons = document.querySelectorAll(".game_buttons");
let box = document.getElementById("game_box");
let count=document.querySelector("#count");
let player_nama=document.getElementById("player_name");
let anime_name= document.getElementById("an_player");

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let user_name = document.getElementById("user_name").value;
  player_nama.innerHTML = user_name;
  let eventData = {
    eventName: "JOIN_GAME",
    data: {
      name: user_name,
    },
  };
  sendToSocket(socket, eventData);
});

function resetGame(){
  buttons.forEach(element=>{
   
    element.disabled = false;
    element.innerHTML='<span>*</span>'
  })
}

function startGame(data) {
  count.innerHTML = "<div>Game Start</div>";
  setTimeout(() => {
    count.classList.remove("show");
    count.classList.add("hide");
  }, 2000);
}

function joinGame(data) {
  if (data.status == "waiting") {
    count.innerHTML = `
    <div class="waiting_content">
      <div class="center">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
      </div>
      <h2>waiting for other player...</h2>
    </div>`;
  } else {
    if (data.userData[0]._id == userId) {
      anime_name.innerHTML = data.userData[1].name;
      tableId = data.tableId;
    }else{
      anime_name.innerHTML = data.userData[0].name;
      tableId = data.tableId;
    }
  }
}

// set event on all button : move event
buttons.forEach((element, index) => {
  element.addEventListener("click", () => {
    let data = {
      eventName: "MOVE",
      data: {
        userId:userId,
        id: index,
        symbol,
        tableId,
      },
    };
    sendToSocket(socket, data);
  });
});

// get anime turn data and set on board
const move = (data) => {
  setBoard(data.board);
};

// check turn and high lite user how have turn
let checkTurn = (turn) => {
  if (turn) {
   player_nama.classList.add("active");
    buttons.forEach((element) => {
      if (element.innerHTML == "<span>*</span>") {
        element.removeAttribute("disabled");
      }
    });
  } else {
   player_nama.classList.remove("active");
    buttons.forEach((element) => {
      element.disabled = true;
    });
  }
};
 
// check game : check combination "xxx" or "ooo" if mat ch then some one winner
let gameOver = (data) => {
  count.classList.add('show')
  player_nama.innerHTML = "_";
  anime_name.innerHTML = "_";
  count.innerHTML = `<div class="win_box "></div>`;
 setTimeout(() => {
  if (data.winner == symbol) {
    count.innerHTML = `<div class="win_box "><img src="win.png" alt=""></div>`;
  }else if (data.winner == 'tie') {
    count.innerHTML = `<div class="win_box "><img src="tie.gif" alt=""></div>`;
  }
   else {
    count.innerHTML = `<div class="win_box "><img src="lose.png" alt=""></div>`;
  }
 }, 750);

 setTimeout(() => {
  resetGame()
  count.innerHTML = `<div class="win_box text-center" style="line-height:315px;"> <button
  type="button"
  class="btn  m-btn w-auto h-auto"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
>
  Replay
</button></div>`;
 }, data.delayTime*1000);
};
let roundTimerStart =(data)=>{
  var second = data.delayTime;
  let countInterval = setInterval(() => {
    if (second > 0) {
      count.innerHTML = `<span>${second}</span>`;
      second--;
    } else {
      clearInterval(countInterval);
    }
  }, 1000);
}

let setBoard = (boardData) => {
  buttons.forEach((element, index) => {
    if (boardData[index] == null) {
      element.innerHTML = `<span>*</span>`;
    } else {
      element.innerHTML = boardData[index];
    }
  });
};

let userTurnStarted = (data)=>{
  if(data.userId==userId){
    turn=true,
    symbol=data.symbol;

  }else{  
    turn=false
  }
  checkTurn(turn);
}

socket.onAny((eventName, data) => {
    console.log(`REQUEST EVENT NAME :${eventName}  : REQUEST DATA : ${JSON.stringify(data.data)}`)
    switch (eventName) {
      case "SIGN_UP":
        userId = data.data.userId;
        break;
      case "JOIN_GAME":
        joinGame(data.data);
        break;
      case "START_GAME":
        startGame(data.data);
        break;
      case "MOVE":
        move(data.data);
        break;
      case "WIN_GAME":
        gameOver(data.data);
        break;
      case "ROUND_TIMER_START":
        roundTimerStart(data.data);
        break;
      case "USER_TURN_STARTED":
        userTurnStarted(data.data);
        break;
    }
});

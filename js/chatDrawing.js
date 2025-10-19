//@ts-check
const drawingCanvas = document.getElementById("chatCanvas");
// @ts-ignore
const chatsDisplay = document.getElementById("chatsDisplay");
// @ts-ignore
const statusText = document.getElementById("status-text");

const brushSize = 3;

const urlSearchParams = new URLSearchParams(window.location.search);
const messageList = document.getElementById("messageList");
/**
 * @type {boolean}
 */
var messageSending;
var ourID;

//connect with websocket

const socket = new WebSocket("wss://mpc.xplate.dev/ws");
window.addEventListener("unload", () => {
  socket.send("close");
});

// @ts-ignore

socket.onmessage = (
  /**
   * @type {MessageEvent}
   */ event
) => {
  var data;
  try {
    data = JSON.parse(event.data);
  } catch (er) {
    data = event.data;
  }
  console.log("Got message: " + data);
  if (data == "reloadChats") {
    reloadChats();
  } else if (Object.hasOwn(data, "id")) {
    ourID = data.id;
  } else if (Object.hasOwn(data, "type") && Object.hasOwn(data, "username")) {
    switch (data.type) {
      case 2:
        makeChatHtmlElement(data.username, data.data, false);
        break;

      case 0:
        makeChatJoinNotifElement(data.username);
        break;

      case 1:
        makeChatLeaveNotifElement(data.username);
        break;

      default:
        break;
    }
  } else if (Object.hasOwn(data, "chatStatus")) {
    if (!messageSending) {
      console.warn("Somehow we sent a chat without an html element");
      return;
    }
    if (data.chatStatus == 200) {
      var element;
      if (
        messageSending &&
        (element = document.getElementById("sendingText")) != null
      ) {
        element.innerText = "Sent!";
        messageSending = false;
      }
    }
  }
};

socket.addEventListener("open", (event) => {
  setInterval(function () {
    socket.send("ping");
  }, 5000);
  if (urlSearchParams.has("join")) {
    socket.send(
      JSON.stringify({
        messageType: 0,
        data: JSON.stringify({
          roomID: urlSearchParams.get("join"),
          username: localStorage.getItem("name"),
        }),
      })
    );
  }
});

function reloadChats() {
  fetch("https://mpc.xplate.dev/api/getRoomsAndPeopleInThem").then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        //const parsed = JSON.parse(data);
        let peopleOn = 0;
        let chatsOpen = 0;

        const collection = document.querySelectorAll("div.chatDisplayChlid");
        collection.forEach(function (element) {
          element.remove();
        });

        for (const key in data) {
          peopleOn += data[key].peopleCurrently;
          chatsOpen++;
          const chatVisualHTML = `
		<div
          class="chatDisplayChlid"
          style="
            min-height: 4rem;
            background-color: white;
            border: 0.2rem double black;
			margin-bottom: 0.6rem;
          "
        >
          <p
            style="
              margin: -3px 0;
              -webkit-text-fill-color: white;
              -webkit-text-stroke: 1px;
              user-select: none;
            "
            class="bbh-sans-bartle-regular"
          >
            ${data[key].name}
          </p>
          <img
            src="people.png"
            style="image-rendering: crisp-edges; padding-left: 4px; margin-top: 4px;"
            width="20px"
          />
          <i
            class="noto-sans"
            style="-webkit-text-stroke: 0; -webkit-text-fill-color: black"
            ><sup>${data[key].peopleCurrently}/${data[key].maxPeople}</sup></i
          >
          <div style="display: flex; padding: 5px; justify-content: right">
            <button>Join!</button>
          </div>
        </div>`;
          // @ts-ignore
          chatsDisplay?.insertAdjacentHTML("beforeend", chatVisualHTML);
          console.log(
            `chat with id: ${key}, has ${data[key].peopleCurrently}/${data[key].maxPeople} people in it`
          );
        }
        // @ts-ignore
        if (statusText != null)
          // @ts-ignore
          statusText.innerHTML = `<i>${peopleOn} people are online in ${chatsOpen} chats.</i>`;
        else console.error("No status text!");
      });
    }
  });
}

if (drawingCanvas != null) {
  /**
   * @type {CanvasRenderingContext2D}
   */
  // @ts-ignore
  const ctx = drawingCanvas.getContext("2d");
  var beingHeld = false;
  /**
   * @type {number}
   */
  var mousePositionX;
  /**
   * @type {number}
   */
  var mousePositionY;

  function moved() {
    // @ts-ignore
    var setIntervalId = setInterval(() => {
      if (beingHeld)
        ctx.fillRect(mousePositionX, mousePositionY, brushSize, brushSize);
    }, 0);
  }

  drawingCanvas.addEventListener("mousedown", function () {
    beingHeld = true;
  });
  drawingCanvas.addEventListener("mouseup", function () {
    beingHeld = false;
  });
  drawingCanvas.addEventListener("mouseleave", function () {
    beingHeld = false;
  });
  drawingCanvas.addEventListener("mousemove", function (e) {
    mousePositionX = e.offsetX;
    mousePositionY = e.offsetY / 1.12;
    //console.log(ctx.canvas.width + " : " + e.offsetX);
    //console.log(ctx.canvas.height + " : " + e.offsetY);

    moved();
  });
}

reloadChats();

/**
 * @param {string} username
 * @param {string} imageUri
 * @param {boolean} fromSelf
 */
function makeChatHtmlElement(username, imageUri, fromSelf) {
  if (messageSending) {
    console.error("Message already sending.");
    return false;
  }
  const html = `<li>
            <b
              >&lt;${username}&gt;
              <i id="sendingText" style="font-size: 1rem; -webkit-text-fill-color: #adadad"
                >${fromSelf ? "Sending..." : ""}</i
              ></b
            ><br />
            <img alt="Image sent by user." src="${imageUri}" />
          </li>`;
  if (fromSelf) messageSending = true;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {string} username
 */
function makeChatJoinNotifElement(username) {
  const html = `<li
            style="
              background-color: greenyellow;
              background-image: url(player-entered.png);
              height: 1.2rem;
            "
          >
            User connected: <b>${username}</b>
          </li>`;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {string} username
 */
function makeChatLeaveNotifElement(username) {
  const html = `<li
            style="
              background-color: rgb(255, 47, 47);
              background-image: url(player-left.png);
              height: 1.2rem;
            "
          >
            User left: <b>${username}</b>
          </li>`;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

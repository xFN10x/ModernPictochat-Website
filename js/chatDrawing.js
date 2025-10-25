//@ts-check

class LinkedNode {
  /**
   * @param {any} value
   */
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
  }
  /**
   * @param {any} value
   */
  append(value) {
    let newnode = new LinkedNode(value);
    if (!this.head) {
      this.head = newnode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newnode;
  }
  getLast() {
    let current = this.head;
    let lastCurrent = this.head;
    let result = "";
    while (current) {
      lastCurrent = current;
      result += current.value + "->";
      current = current.next;
    }
    return lastCurrent.value;
  }
  /**
   * @param {any} value
   */
  delete(value) {
    if (!this.head) {
      console.log("list is empty no element to delete");
      return;
    }
    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }
    let prev = null;
    let current = this.head;
    while (current && current.value !== value) {
      prev = current;
      current = current.next;
    }
    if (!current) {
      console.log("value is not found in list");
      return;
    }
    prev.next = current.next;
  }
}

const drawingCanvas = document.getElementById("chatCanvas");
// @ts-ignore
const chatsDisplay = document.getElementById("chatsDisplay");
// @ts-ignore
const statusText = document.getElementById("status-text");
const userDisplay = document.getElementById("peopleHereDisplay");

const brushSize = 3;

// @ts-ignore
const defaultIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0BAMAAAA5+MK5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAeUExURQAAAAMDA+/v7/////T09BAQEPr6+vn5+fX19f7+/sOgV/8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAjpJREFUeNrt20ENQjEQRdFvAQtYqAUsYAELWMACbtmTvMUk/dBMz913pqf7HseSXVL/vhg6Ojo6Ojo6Ojo6Ojo6Ojo6Onrz0NHR0ZuHjo6O3jx0dHT05qGjo6M3Dx0dHb156Ojo6Od3bRI6Ojo6Ojo6eoPQ0dHR0dHR0RuEjo6Ojo6Ojt4gdHR0dHR0dPQGoaOjo6Ojo6M3CB0dHb1KH6k4apT7xSh0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR09O70W+qeeqTifeOoZ+qVQkdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dH/24sGTo6Ojo6Ojo6Ojo6Ojo6+nqho6Ojo6Ojo6Ojo6Ojo6OvFzo6Ojo6Ojo6Ojo6Ojo6+nqhn0uvV4fEUe8UOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ovq29Hhi4pvE6svR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0belz1xSrv4zBB0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR19W3p9+8TQ0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dElSZIkSZIkSZIkSZIkSZIkSZJW7gO8gusn2MJ+5wAAAABJRU5ErkJggg==";

const urlSearchParams = new URLSearchParams(window.location.search);
const messageList = document.getElementById("messageList");
/**
 * @type {boolean}
 */
var messageSending;
/**
 * @type {string}
 */
var ourID;
/**
 * @type {string | null}
 */
let chatIn = null;

//connect with websocket

const socket = new WebSocket(
  window.location.protocol +
    "//" +
    window.location.hostname +
    (window.location.port !== "" ? ":" + window.location.port : "") +
    "/ws"
);
window.addEventListener("unload", () => {
  socket.send("close");
});

// @ts-ignore
// @ts-ignore
socket.onclose = (ev) => {
  makeErrorNotifElement("(Socket closed.)");
};
// @ts-ignore
socket.onerror = (event) => {
  // @ts-ignore
  var reason;
  if (event.code == 1000)
    reason =
      "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
  else if (event.code == 1001)
    reason =
      'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
  else if (event.code == 1002)
    reason =
      "An endpoint is terminating the connection due to a protocol error";
  else if (event.code == 1003)
    reason =
      "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
  else if (event.code == 1004)
    reason = "Reserved. The specific meaning might be defined in the future.";
  else if (event.code == 1005) reason = "No status code was actually present.";
  else if (event.code == 1006)
    reason =
      "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
  else if (event.code == 1007)
    reason =
      "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
  else if (event.code == 1008)
    reason =
      'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
  else if (event.code == 1009)
    reason =
      "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
  else if (event.code == 1010)
    // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
    reason =
      "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
      event.reason;
  else if (event.code == 1011)
    reason =
      "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
  else if (event.code == 1015)
    reason =
      "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
  else reason = "Unknown reason";
  makeErrorNotifElement(event.reason);
};

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
    // @ts-ignore
    updatePlayerList(chatIn);
  } else if (data == "Verified") {
    setInterval(function () {
      socket.send("ping");
    }, 5000);
    if (urlSearchParams.has("join")) {
      fetch(
        window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port !== "" ? ":" + window.location.port : "") +
          "/api/getChatById/" +
          urlSearchParams.get("join")
      ).then((res) => {
        if (res.ok) {
          res.text().then((val) => {
            makeChatNotifElement(val);
            // @ts-ignore
            updatePlayerList(urlSearchParams.get("join"));
            chatIn = urlSearchParams.get("join");
            socket.send(
              JSON.stringify({
                messageType: 0,
                data: JSON.stringify({
                  roomID: urlSearchParams.get("join"),
                  // @ts-ignore
                  user: JSON.parse(localStorage.getItem("userInfo")) /*{
                    username: ,
                    iconData: defaultIcon,
                    messagesSent: 0,
                    rgb: "#000000",
                  },*/,
                }),
              })
            );
            urlSearchParams.delete("join");
          });
        }
      });
    }
  } else if (data == "goBack") {
    window.location.href = "/";
  } else if (Object.hasOwn(data, "id")) {
    ourID = data.id;
  } else if (Object.hasOwn(data, "shownError")) {
    makeErrorNotifElement(data.shownError);
  } else if (Object.hasOwn(data, "shownMessage")) {
    makeSilentNotifElement(data.shownMessage);
  } else if (Object.hasOwn(data, "type") && Object.hasOwn(data, "user")) {
    switch (data.type) {
      case 2:
        makeChatHtmlElement(data.user, data.data, false);
        break;

      case 0:
        makeChatJoinNotifElement(data.user, data.chat.name);
        break;

      case 1:
        makeChatLeaveNotifElement(data.user, data.chat.name);
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
var authed = false;
// @ts-ignore
socket.addEventListener("open", (event) => {
  if (!authed && urlSearchParams.has("key")) {
    socket.send("HANDSHAKE " + urlSearchParams.get("key"));
    urlSearchParams.delete("key");
  }
});

function reloadChats() {
  fetch(
    window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port !== "" ? ":" + window.location.port : "") +
      "/api/getRoomsAndPeopleInThem"
  ).then((res) => {
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
            <button onclick="joinChat('${data[key].name}')">Join!</button>
          </div>
        </div>`;
          // @ts-ignore
          chatsDisplay?.insertAdjacentHTML("beforeend", chatVisualHTML);
          //console.log(
          //  `chat with id: ${key}, has ${data[key].peopleCurrently}/${data[key].maxPeople} people in it`
          //);
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

/**
 * @param {string} id
 */
function joinChat(id) {
  fetch(
    window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port !== "" ? ":" + window.location.port : "") +
      "/api/getChatByName/" +
      id
  ).then((res) => {
    if (res.ok) {
      res.text().then((txt) => {
        socket.send(
          JSON.stringify({
            messageType: 2,
          })
        );
        makeChatNotifElement(id);
        chatIn = txt;
        updatePlayerList(txt);

        socket.send(
          JSON.stringify({
            messageType: 0,
            data: JSON.stringify({
              roomID: txt,
              // @ts-ignore
              user: JSON.parse(localStorage.getItem("userInfo")),
            }),
          })
        );
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
   * @type {number | null}}
   */
  var mousePositionX;
  /**
   * @type {number | null}
   */
  var mousePositionY;

  drawingCanvas.addEventListener("mousedown", function (e) {
    beingHeld = true;
    drawLine(
      ctx,
      e.offsetX + 0.01,
      e.offsetY / 1.12,
      e.offsetX - 0.01,
      e.offsetY / 1.12
    );
  });
  document.addEventListener("mouseup", function () {
    beingHeld = false;
  });
  drawingCanvas.addEventListener("mouseleave", function () {
    mousePositionY = null;
    mousePositionX = null;
  });
  drawingCanvas.addEventListener("mousemove", function (e) {
    if (beingHeld) {
      if (mousePositionX == null) {
        mousePositionX = e.offsetX;
      }
      if (mousePositionY == null) {
        mousePositionY = e.offsetY / 1.12;
      }
      drawLine(
        ctx,
        mousePositionX,
        mousePositionY,
        e.offsetX,
        e.offsetY / 1.12
      );
      mousePositionX = e.offsetX;
      mousePositionY = e.offsetY / 1.12;
    } else {
      mousePositionY = null;
      mousePositionX = null;
    }
  });

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    // @ts-ignore
    context.strokeStyle = JSON.parse(localStorage.getItem("userInfo")).rgb;
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }
  ctx.font = "25px Pictochat";
  var currentTextLine = 1;
  var lineX = 1;
  let lineHeight = 20;
  var widths = new LinkedList();
  /**
   * @param {string} text
   */
  function typeText(text) {
    var mes = ctx.measureText(text);
    if (lineX + mes.width > 290) {
      lineX = 1;
      currentTextLine++;
    }

    // @ts-ignore
    ctx.fillStyle = JSON.parse(localStorage.getItem("userInfo")).rgb;
    ctx.fillText(text, lineX, currentTextLine * lineHeight);

    lineX += mes.width;
    console.log(mes.width);
    widths.append(mes.width);
  }

  document.onkeydown = function (e) {
    if (e.key === "Enter") {
      onEnter();
      return;
    }
    if (e.key === "Backspace") {
      if (!e.shiftKey) return;
      // @ts-ignore
      ctx.fillStyle = "#ffffffff";
      ctx.fillRect(
        lineX - widths.getLast() - 1,
        (currentTextLine - 1) * lineHeight,
        widths.getLast() + 1,
        lineHeight + 2
      );
      lineX -= widths.getLast();
      if (lineX <= 0 && currentTextLine > 1) {
        lineX = 290;
        currentTextLine--;
      } else if (lineX <= 0 && currentTextLine <= 1) {
        lineX = 1;
        currentTextLine = 1;
      }
      console.log(widths.getLast());
      widths.delete(widths.getLast());
      return;
    }
    if (
      !(
        /*e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||*/
        (
          e.key === "CapsLock" ||
          e.key === "Meta" ||
          e.key === "Shift" ||
          e.key === "Alt" ||
          e.key === "Tab" ||
          e.key === "F1" ||
          e.key === "F2" ||
          e.key === "F3" ||
          e.key === "F4" ||
          e.key === "F5" ||
          e.key === "F6" ||
          e.key === "F7" ||
          e.key === "F8" ||
          e.key === "F9" ||
          e.key === "F10" ||
          e.key === "F11" ||
          e.key === "F12" ||
          e.key === "F13" ||
          e.key === "F14" ||
          e.key === "F15"
        )
      )
    )
      typeText(e.key);
  };

  // @ts-ignore
  function clearCanvas() {
    currentTextLine = 1;
    lineX = 1;
    // @ts-ignore
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }
}

reloadChats();

/**
 * @param {{username: string, iconData: string, messagesSent: number, rgb: string}} userInfo
 * @param {string} imageUri
 * @param {boolean} fromSelf
 */
function makeChatHtmlElement(userInfo, imageUri, fromSelf) {
  if (messageSending) {
    makeSilentNotifElement("Please wait until your last message sends.");
    console.warn("Message already sending.");
    return false;
  }
  const html = `<li>
            <b style="-webkit-text-fill-color: ${userInfo.rgb}"
              >&lt;${userInfo.username}&gt;
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
 * @param {{username: string, iconData: string, messagesSent: number, rgb: string}} userInfo
 * @param {string} [chatName]
 */
function makeChatJoinNotifElement(userInfo, chatName) {
  // @ts-ignore
  if (
    // @ts-ignore
    userInfo.username === JSON.parse(localStorage.getItem("userInfo")).username
  ) {
    var html = `<li
            style="
              background-color: greenyellow;
              background-image: url(player-entered.png);
            "
          >
            Connected to ${chatName}
          </li>`;
  } else {
    var html = `<li
            style="
              background-color: greenyellow;
              background-image: url(player-entered.png);
            "
          >
            User connected: <b style="-webkit-text-fill-color: ${userInfo.rgb}">${userInfo.username}</b>
          </li>`;
  }
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {{username: string, iconData: string, messagesSent: number, rgb: string}} userInfo
 * @param {string} [chatName]
 */
function makeChatLeaveNotifElement(userInfo, chatName) {
  // @ts-ignore
  if (
    // @ts-ignore
    userInfo.username === JSON.parse(localStorage.getItem("userInfo")).username
  ) {
    var html = `<li
            style="
              background-color: #ff0000;
              background-image: url(player-left.png);
            "
          >
            Disconnected from ${chatName}
          </li>`;
  } else {
    var html = `<li
            style="
              background-color: #ff0000;
              background-image: url(player-left.png);
            "
          >
            User Disconnected: <b style="-webkit-text-fill-color: ${userInfo.rgb}">${userInfo.username}</b>
          </li>`;
  }
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {string} extra
 */
function makeErrorNotifElement(extra) {
  const html = `<li
            style="
              background-color: rgb(255, 47, 47);
              background-image: url(error.png);
            "
          >
            An error occured! ${extra}
          </li>`;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {string} extra
 */
function makeSilentNotifElement(extra) {
  const html = `<li
            style="
              background-color: #aeaeae;
              background-image: url(silentMessage.png);
            "
          >
            ${extra}
          </li>`;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

/**
 * @param {string} chat
 */
function makeChatNotifElement(chat) {
  const html = `<li
            style="
              background-color: #e7e7e7ff;
              background-image: url(chatIcon.png);
            "
          >
            Entering ${chat}...
          </li>`;
  messageList?.insertAdjacentHTML("afterbegin", html);
  return true;
}

function onEnter() {
  /**
   * @type {HTMLCanvasElement}
   */
  // @ts-ignore
  var canvas = document.getElementById(`chatCanvas`);
  var img = new Image(canvas?.width, canvas?.height);
  img.src = canvas.toDataURL("image/png");

  var targetImg = new Image();

  // @ts-ignore
  const setAttribute = img.setAttribute;
  // override setAttribte
  // @ts-ignore
  img.setAttribute = (key, value) => {
    if (key === "cropped") {
      if (
        !makeChatHtmlElement(
          // @ts-ignore
          JSON.parse(localStorage.getItem(`userInfo`)),
          // @ts-ignore
          targetImg.src,
          true
        )
      ) {
        return;
      }

      const json = JSON.stringify({
        messageType: 1,
        data: JSON.stringify({
          data: targetImg.src,
          id: ourID,
        }),
      });
      console.log(json);
      socket.send(json);
      // @ts-ignore
      clearCanvas();
    }
  };

  // @ts-ignore
  autocrop(
    img,
    targetImg,
    `{
    bgColor: '#FFFFFF',
    alphaTolerance: 20,
    colorTolerance: 20,
    invertTolerance: 0.90,
    margin: '2%',
    allowInvert: true,
    marker: 'cropped'
}`
  );
}

/**
 * @param {string} chatID
 */
function updatePlayerList(chatID) {
  fetch(
    window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port !== "" ? ":" + window.location.port : "") +
      "/api/getPeopleInChat/" +
      chatID
    //urlSearchParams.get("join")
  ).then((rs) => {
    if (rs.ok) {
      // @ts-ignore
      rs.json().then((json) => {
        // @ts-ignore
        userDisplay.innerHTML = "";
        // @ts-ignore
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const yourHTML = `<li
            style="
              background-color: ${userInfo.rgb}1f;
              -webkit-text-fill-color: ${userInfo.rgb};
            "
          >
                  ${userInfo.username} ${
          userInfo.username ===
          JSON.parse(
            // @ts-ignore
            localStorage.getItem("userInfo")
          ).username
            ? "<b>(You)</b>"
            : ""
        }
          </li>`;
        userDisplay?.insertAdjacentHTML("afterbegin", yourHTML);
        //console.log(json);
        let namesAlreadyAdded = [];
        for (const key in json) {
          if (
            json[key].username === userInfo.username ||
            namesAlreadyAdded.indexOf(json[key].username) != -1
          ) {
            continue;
          }
          console.log(namesAlreadyAdded);
          namesAlreadyAdded.push(json[key].username);
          const html = `<li
            style="
              background-color: ${json[key].rgb}1f;
              -webkit-text-fill-color: ${json[key].rgb};
            "
          >
                  ${json[key].username} ${
            json[key].username ===
            JSON.parse(
              // @ts-ignore
              localStorage.getItem("userInfo")
            ).username
              ? "<b>(You)</b>"
              : ""
          }
          </li>`;
          userDisplay?.insertAdjacentHTML("afterbegin", html);
          //console.log(json[key].username);
        }
      });
    }
  });
}

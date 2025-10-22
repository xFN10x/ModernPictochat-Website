//@ts-check
const drawingCanvas = document.getElementById("chatCanvas");
// @ts-ignore
const chatsDisplay = document.getElementById("chatsDisplay");
// @ts-ignore
const statusText = document.getElementById("status-text");

const brushSize = 3;

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
socket.onclose = (ev) => {
  makeErrorNotifElement("Socket closed.")
}
// @ts-ignore
socket.onerror = (event) => {
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
          user: {
            username: localStorage.getItem("name"),
            iconData: defaultIcon,
            messagesSent: 0,
            rgb: "#000000",
          },
        }),
      })
    );
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
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  }
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

/**
 * @param {string} extra
 */
function makeErrorNotifElement(extra) {
  const html = `<li
            style="
              background-color: rgb(255, 47, 47);
              background-image: url(error.png);
              height: 1.2rem;
            "
          >
            An error occured! Please try to join another room. ${extra}
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

  const setAttribute = img.setAttribute;
  // override setAttribte
  img.setAttribute = (key, value) => {
    if (key === "cropped") {
      if (
        !makeChatHtmlElement(
          // @ts-ignore
          localStorage.getItem(`name`),
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

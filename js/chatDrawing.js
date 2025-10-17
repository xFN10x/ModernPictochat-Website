//@ts-check
const drawingCanvas = document.getElementById("chatCanvas");

const brushSize = 3;

//connect with websocket
const socket = new WebSocket("wss://mpc.xplate.dev/ws/chat");
socket.addEventListener("open", (event) => {
  socket.send("Hello Server!");
});

fetch("https://mpc.xplate.dev/api/getRoomsAndPeopleInThem").then((res) => {
  if (res.ok) {
    res.json().then((data) => {
      //const parsed = JSON.parse(data);
      let peopleOn = 0;
      let chatsOpen = 0;
      for (const key in data) {
        peopleOn += data[key].peopleCurrently;
        chatsOpen++;
        const chatVisualHTML = `
		<div
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
        chatsDisplay?.insertAdjacentHTML("beforeend", chatVisualHTML);
        console.log(
          `chat with id: ${key}, has ${data[key].peopleCurrently}/${data[key].maxPeople} people in it`
        );
      }
      if (statusText != null)
        statusText.innerHTML = `<i>${peopleOn} people are online in ${chatsOpen} chats.</i>`;
      else console.error("No status text!");
    });
  }
});

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
    console.log(ctx.canvas.height + " : " + e.offsetY);

    moved();
  });
}

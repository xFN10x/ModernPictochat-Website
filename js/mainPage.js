// @ts-nocheck
const defaultIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0BAMAAAA5+MK5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAeUExURQAAAAMDA+/v7/////T09BAQEPr6+vn5+fX19f7+/sOgV/8AAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAAjpJREFUeNrt20ENQjEQRdFvAQtYqAUsYAELWMACbtmTvMUk/dBMz913pqf7HseSXVL/vhg6Ojo6Ojo6Ojo6Ojo6Ojo6Onrz0NHR0ZuHjo6O3jx0dHT05qGjo6M3Dx0dHb156Ojo6Od3bRI6Ojo6Ojo6eoPQ0dHR0dHR0RuEjo6Ojo6Ojt4gdHR0dHR0dPQGoaOjo6Ojo6M3CB0dHb1KH6k4apT7xSh0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR09O70W+qeeqTifeOoZ+qVQkdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dH/24sGTo6Ojo6Ojo6Ojo6Ojo6+nqho6Ojo6Ojo6Ojo6Ojo6OvFzo6Ojo6Ojo6Ojo6Ojo6+nqhn0uvV4fEUe8UOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ovq29Hhi4pvE6svR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0belz1xSrv4zBB0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR19W3p9+8TQ0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dElSZIkSZIkSZIkSZIkSZIkSZJW7gO8gusn2MJ+5wAAAABJRU5ErkJggg==";

const statusText = document.getElementById("status-text");
const chatsDisplay = document.getElementById("chatsDisplay");
const signupCaptcha = document.getElementById("signupCaptcha");
/**
 * @type {HTMLInputElement}
 */
const usernameInput = document.getElementById("usernameInput");
/**
 * @type {HTMLInputElement}
 */
const colorInput = document.getElementById("accentInput");
/**
 * @type {string | null}
 */
var captChaKey = null;

if (
  JSON.parse(localStorage.getItem("userInfo")) != null &&
  localStorage.getItem("userInfo") !== ""
) {
  if (
    JSON.parse(localStorage.getItem("userInfo")).username != null &&
    JSON.parse(localStorage.getItem("userInfo")).username !== ""
  ) {
    // @ts-ignore
    usernameInput.value = JSON.parse(localStorage.getItem("userInfo")).username;
  }

  if (
    JSON.parse(localStorage.getItem("userInfo")).rgb != null &&
    JSON.parse(localStorage.getItem("userInfo")).rgb !== ""
  ) {
    colorInput.value = JSON.parse(localStorage.getItem("userInfo")).rgb;
  }
}

/**
 * @param {string} id
 */
function joinChat(id) {
  /*var capchaValid = false;
  fetch(
    window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port !== "" ? ":" + window.location.port : "") +
      "/api/capchaValid",
    {
      method: "POST",
      body: captChaKey,
      headers: {
        "Content-type": "text/plain; charset=UTF-8",
      },
    }
  ).then((res) => {
    if (res.ok) {
      res.json().then((val) => {
        console.log("Got captchaValid body: " + val.success);

        if (!val.success) {
          console.error("Captcha isnt valid; cannot join.");
          return;
        }
*/
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
        if (usernameInput.value !== "" && captChaKey != null) {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: usernameInput.value,
              rgb: colorInput.value,
              iconData: defaultIcon,
              messagesSent: 0,
            })
          );
          window.location.href = "chat?join=" + txt + "&key=" + captChaKey;
        } else {
          console.warn("No username / No Captcha");
        }
      });
    }
  });
} /*);
    }
  });
}*/

if (signupCaptcha != null) {
  signupCaptcha.addEventListener("verified", (e) => {
    // @ts-ignore
    captChaKey = e.token;
  });
  signupCaptcha.addEventListener("error", (e) => {
    console.log("error event", { error: e.error });
  });
}

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
            <button onClick=\"joinChat(\`${data[key].name}\`)\" >Join!</button>
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

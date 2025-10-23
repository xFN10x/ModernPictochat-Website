// @ts-nocheck

const statusText = document.getElementById("status-text");
const chatsDisplay = document.getElementById("chatsDisplay");
const signupCaptcha = document.getElementById("signupCaptcha");
const usernameInput = document.getElementById("usernameInput");
/**
 * @type {string | null}
 */
var captChaKey = null;

if (
  localStorage.getItem("name") != null &&
  localStorage.getItem("name") !== ""
) {
  // @ts-ignore
  usernameInput.value = localStorage.getItem("name");
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
          localStorage.setItem("name", usernameInput.value);
          window.location.href = "chat?join=" + txt + "&key=" + captChaKey;
        } else {
          console.warn("No username/ No Captcha");
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

const timeElement = document.getElementById("time");
const nameElement = document.getElementById("name");
const timerElement = document.getElementById("timer");

chrome.action.setBadgeText({ text: "TIME" });

chrome.storage.sync.get(["name"], ({ name = "???" }) => {
   nameElement.textContent = `Your name is: ${name}`;
});

function updateTimeElements() {
   const currentTime = new Date().toLocaleTimeString();
   timeElement.textContent = `The time is: ${currentTime}`;

   chrome.storage.local.get(["timer"], ({ timer = 0 }) => {
      timerElement.textContent = `The timer is at: ${timer} seconds`;
   });
}

updateTimeElements();
setInterval(updateTimeElements, 1000);

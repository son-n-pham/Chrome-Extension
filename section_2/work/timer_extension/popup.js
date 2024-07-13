const timeElement = document.getElementById('time');
const nameElement = document.getElementById('name');
const timerElement = document.getElementById('timer');
const forDebugElement = document.getElementById('for-debug');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

startBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isRunning: true });
});

stopBtn.addEventListener('click', () => {
  chrome.storage.local.set({ isRunning: false });
});

resetBtn.addEventListener('click', () => {
  chrome.storage.local.set({ timer: 0, isRunning: false });
});

chrome.storage.local.get(['timer'], ({ timer = 0 }) => {
  timerElement.textContent = `The timer is at: ${timer} seconds`;
});

chrome.action.setBadgeText({ text: 'TIME' });

chrome.storage.sync.get(['name'], ({ name = '???' }) => {
  nameElement.textContent = `Your name is: ${name}`;
});

function popupContent() {
  const currentTime = new Date().toLocaleTimeString();
  timeElement.textContent = `The time is: ${currentTime}`;

  chrome.storage.local.get(['timer'], ({ timer = 0 }) => {
    timerElement.textContent = `The timer is at: ${timer} seconds`;
  });

  chrome.storage.local.get(['isRunning'], ({ isRunning = false }) => {
    forDebugElement.textContent = `isRunning: ${isRunning}`;
    if (isRunning) {
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
    } else {
      startBtn.style.display = 'inline-block';
      stopBtn.style.display = 'none';
    }
  });
}

popupContent();
setInterval(popupContent, 1000);

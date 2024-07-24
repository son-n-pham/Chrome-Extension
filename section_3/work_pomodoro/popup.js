const addTaskBtn = document.getElementById('add-task');
const taskInputEl = document.getElementById('task-input');
const taskListEl = document.getElementById('task-list');
const timeEl = document.getElementById('time');
const timerBtn = document.getElementById('timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');

let isRunning = false;
let time = 0;

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  timeEl.textContent = timeString;
}

function startTimer() {
  chrome.runtime.sendMessage({ action: 'startTimer' });
  isRunning = true;
  timerBtn.textContent = 'Stop';
}

function stopTimer() {
  chrome.runtime.sendMessage({ action: 'stopTimer' });
  isRunning = false;
  timerBtn.textContent = 'Start';
}

function resetTimer() {
  chrome.runtime.sendMessage({ action: 'resetTimer' });
  time = 0;
  updateDisplay();
}

timerBtn.addEventListener('click', () => {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetTimerBtn.addEventListener('click', resetTimer);

// Update time display every second
setInterval(() => {
  chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
    time = response.time;
    isRunning = response.isRunning;
    updateDisplay();
    timerBtn.textContent = isRunning ? 'Stop' : 'Start';
  });
}, 1000);

// Initialize popup state
chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
  time = response.time;
  isRunning = response.isRunning;
  updateDisplay();
  timerBtn.textContent = isRunning ? 'Stop' : 'Start';
});

// ... (rest of your popup.js code for task list management)

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInputEl.value.trim();
  if (taskText) {
    addTaskToTaskList(taskText);
    taskInputEl.value = '';
  }
});

/**
 * Adds a task to the task list.
 *
 * @param {string} taskText - The text of the task to be added.
 * @return {void} This function does not return a value.
 */
function addTaskToTaskList(taskText) {
  if (!taskText) {
    console.error('Task text is null or undefined');
    return;
  }

  chrome.storage.sync.get(['TaskList'], result => {
    let { TaskList } = result;
    if (!TaskList) {
      TaskList = []; // Initialize TaskList if it doesn't exist
    }

    const newTaskList = [...TaskList];
    newTaskList.push({
      task: taskText,
      createAt: new Date().toISOString(),
    });
    chrome.storage.sync.set({ TaskList: newTaskList }, () => {
      renderTaskList(); // Call renderTaskList inside the callback
    });
  });
}

/**
 * Renders the task list by fetching the task list from the Chrome storage and
 * creating and appending task elements to the task list element.
 *
 * @return {void} This function does not return a value.
 */
function renderTaskList() {
  chrome.storage.sync.get(['TaskList'], result => {
    const taskList = result?.TaskList || []; // Handle empty TaskList gracefully
    taskListEl.textContent = '';
    taskList.forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      const taskDivContent = document.createElement('div');
      const taskText = document.createElement('span');
      taskText.textContent = task?.task ?? '';
      const taskCreatedAt = document.createElement('span');
      taskCreatedAt.textContent = ` (${new Date(
        task?.createAt ?? 0
      ).toLocaleString()})`;
      taskDivContent.appendChild(taskText);
      taskDivContent.appendChild(taskCreatedAt);
      const taskDeleteBtn = document.createElement('input');
      taskDeleteBtn.type = 'button';
      taskDeleteBtn.value = 'X';
      taskDeleteBtn.className = 'task-delete';
      taskDeleteBtn.addEventListener('click', () => {
        deleteTask(index);
      });
      taskDiv.appendChild(taskDivContent);
      taskDiv.appendChild(taskDeleteBtn);
      taskListEl.appendChild(taskDiv);
    });
  });
}

function deleteTask(index) {
  chrome.storage.sync.get(['TaskList'], ({ TaskList }) => {
    const newTaskList = TaskList.filter((_, i) => i !== index);
    chrome.storage.sync.set({ TaskList: newTaskList });
    renderTaskList();
  });
}

renderTaskList();
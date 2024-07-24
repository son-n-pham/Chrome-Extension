const addTaskBtn = document.getElementById('add-task');
const taskInputEl = document.getElementById('task-input');
const taskListEl = document.getElementById('task-list');
const timerEl = document.getElementById('timer');
const startTimerBtn = document.getElementById('start-timer-btn');
const stopTimerBtn = document.getElementById('stop-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');

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
    const { TaskList } = result;
    if (!TaskList) {
      console.error('TaskList is null or undefined');
      return;
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
    const taskList = result?.TaskList;
    if (!taskList) {
      taskListEl.textContent = '';
      return;
    }
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

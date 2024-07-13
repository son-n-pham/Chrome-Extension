const nameInput = document.getElementById('name-input');
const timeInput = document.getElementById('time-input');
const saveBtn = document.getElementById('save-btn');

saveBtn.addEventListener('click', () => {
  const name = nameInput.value;
  const notificationTime = timeInput.value;
  chrome.storage.sync.set({ name, notificationTime });
  console.log(`Name: ${name}`);
  console.log('Notification time: ' + notificationTime);
});

chrome.storage.sync.get(['name'], res => {
  nameInput.value = res.name ?? '???';
  timeInput.value = res.notificationTime ?? 1000;
});

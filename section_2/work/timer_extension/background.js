chrome.alarms.create({
    periodInMinutes: 1 / 60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(["timer"], (res) => {
        const time = res.timer ?? 0
        chrome.storage.local.set({
            timer: time + 1,
        })
        chrome.action.setBadgeText({
            text: `${time + 1}`
        })

chrome.alarms.onAlarm.addListener(alarm => {
  chrome.storage.sync.get(['notificationTime'], res => {
    notificationTime = res.notificationTime;
  });

  chrome.storage.local.get(['isRunning'], res => {
    console.log(`From background: ${res.isRunning}`);
    if (res.isRunning) {
      chrome.storage.local.get(['timer'], res => {
        const time = res.timer ?? 0;

        chrome.storage.local.set({
          timer: time + 1,
        });

        chrome.action.setBadgeText({
          text: `${time + 1}`,
        });

        if (time % notificationTime === 0) {
          chrome.notifications.create('notification-id', {
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Chrome Timer Extension',
            message: `${notificationTime} seconds has passed!`,
          });
          console.log(`notificationTime is: ${notificationTime}`);
        }
      });
    }

    console.log(`From background: ${time + 1}`);
  });
});

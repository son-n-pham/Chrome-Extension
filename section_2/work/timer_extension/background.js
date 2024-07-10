chrome.alarms.create({
    periodInMinutes: 1 / 60,
})

let timeLapsed;

chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.sync.get(["timeLapsed"], (res) => {
        timeLapsed = res.timeLapsed ?? 10
    });

    chrome.storage.local.get(["timer"], (res) => {
        const time = res.timer ?? 0
        
        chrome.storage.local.set({
            timer: time + 1,
        })

        chrome.action.setBadgeText({
            text: `${time + 1}`
        })

        if (time % timeLapsed === 0) {
            chrome.notifications.create("notification-id", {
                type: "basic",
                iconUrl: "icon.png",
                title: "Chrome Timer Extension",
                message: `${timeLapsed} seconds has passed!`,
            });
        }

        console.log(`From background: ${time + 1}`);
    })
})
let isRunning = false;
let time = 0;
let intervalId;
const TIMER_DURATION = 0.25 * 60; // 0.25 minutes in seconds

async function setupOffscreenDocument() {
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing audio for break alert',
    });
  }
}

function updateTime() {
  if (isRunning) {
    time++;
    if (time >= TIMER_DURATION) {
      showBreakAlert();
    } else {
      chrome.storage.local.set({ time });
      updateBadgeText();
    }
  }
}

async function getRandomSong() {
  try {
    const response = await fetch(chrome.runtime.getURL('songs.json'));
    const data = await response.json();
    const songs = data.songs;
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      return songs[randomIndex];
    } else {
      console.log('No MP3 files found in the songs.json');
      return null;
    }
  } catch (error) {
    console.error('Error fetching songs.json:', error);
    return null;
  }
}

async function sendMessageToOffscreen(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

async function loadAudio(url) {
  try {
    await sendMessageToOffscreen({ action: 'loadAudio', url });
  } catch (error) {
    console.error('Error loading audio:', error);
    throw error;
  }
}

async function playAudio() {
  try {
    await sendMessageToOffscreen({ action: 'playAudio' });
  } catch (error) {
    console.error('Error playing audio:', error);
    throw error;
  }
}

async function showBreakAlert() {
  clearInterval(intervalId);
  isRunning = false;
  time = 0;
  chrome.storage.local.set({ time: 0, isRunning: false });

  // Show notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Break Time!',
    message: 'Time for a break! Take some rest.'
  });

  // Play random alert sound
  const songFileName = await getRandomSong();
  if (songFileName) {
    try {
      await loadAudio(chrome.runtime.getURL(songFileName));
      await playAudio();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  } else {
    console.log('No song available to play');
  }

  updateBadgeText();
}

function updateBadgeText() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  chrome.action.setBadgeText({ text: timeString });
  chrome.action.setBadgeBackgroundColor({ color: '#0000FF' });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    isRunning = true;
    intervalId = setInterval(updateTime, 1000);
    chrome.storage.local.set({ isRunning: true });
    updateBadgeText();
  } else if (request.action === 'stopTimer') {
    isRunning = false;
    clearInterval(intervalId);
    chrome.storage.local.set({ isRunning: false });
    updateBadgeText();
  } else if (request.action === 'resetTimer') {
    clearInterval(intervalId);
    time = 0;
    chrome.storage.local.set({ time: 0 });
    if (isRunning) {
      intervalId = setInterval(updateTime, 1000);
    }
    updateBadgeText();
  } else if (request.action === 'getTime') {
    sendResponse({ time, isRunning });
  }
});

// Initialize timer state from storage and setup offscreen document
chrome.storage.local.get(['time', 'isRunning'], async (result) => {
  time = result.time || 0;
  isRunning = result.isRunning || false;
  if (isRunning) {
    intervalId = setInterval(updateTime, 1000);
  }
  updateBadgeText();
  
  try {
    await setupOffscreenDocument();
    console.log('Offscreen document setup complete');
  } catch (error) {
    console.error('Error setting up offscreen document:', error);
  }
});
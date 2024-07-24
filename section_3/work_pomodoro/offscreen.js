let audioContext;
let audioBuffer;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'loadAudio') {
    loadAudio(message.url)
      .then(() => sendResponse({ status: 'loaded' }))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicates that the response is sent asynchronously
  } else if (message.action === 'playAudio') {
    playAudio()
      .then(() => sendResponse({ status: 'played' }))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Indicates that the response is sent asynchronously
  }
});

async function loadAudio(url) {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

function playAudio() {
  return new Promise((resolve, reject) => {
    if (audioContext && audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      source.onended = resolve;
    } else {
      reject(new Error('Audio context or buffer is not available'));
    }
  });
}

console.log('Offscreen document loaded and ready');
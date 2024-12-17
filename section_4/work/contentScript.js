// console.log("Hello from content script");

// // Select all all links on the page
// const links = document.querySelectorAll("a");

// // Change all text from each link to "Hello World"
// links.forEach(link => {
// //   link.textContent = "Hello World";
//     if (link.textContent.includes("i")) {
//         link.style = "background-color: yellow"
//     }
// });

const text = [];
const aTags = document.getElementsByTagName("a");
for (const tag of aTags) {
    text.push(tag.textContent);
}

chrome.storage.local.set({text});

chrome.runtime.sendMessage(null, text, (response) => {
    console.log("I'm from the sendResponse in background.js: " + response);
});

const messageFromContentScript = "Hello from the content script";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log(sender);
    sendResponse(messageFromContentScript);
});
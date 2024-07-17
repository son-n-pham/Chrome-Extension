chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.create({
    title: 'Test Context Menu',
    id: 'contactMeu1',
    contexts: ['page', 'selection'],
  });
  chrome.contextMenus.onClicked.addListener(event => console.log(event));
});

console.log('background script is running.');

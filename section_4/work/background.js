chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: "Test Context Menu",
    id: "contextMenu1",
    contexts: ["selection", "page"]
  })

  // Add a listener for when a context menu item is clicked
  chrome.contextMenus.onClicked.addListener((event) => {
    // Log the event object for debugging purposes
    console.log(event);

    // // Perform a search query using Chrome's search API
    // chrome.search.query({
    //   // Open the search results in a new tab
    //   disposition: "NEW_TAB",
    //   // Construct the search query by prepending "imdb" to the selected text
    //   text: `imdb ${event.selectionText}`
    // })

    // Query for all tabs in the current window
    chrome.tabs.query({
      currentWindow: true
    }, tabs => {
      // Log the array of tab objects to the console
      console.log(tabs)
    })

    chrome.tabs.create({
      url: `https://www.imdb.com/find/?q=${event.selectionText}&ref_=nv_sr_sm`
    })
  })
})

console.log("background script is running");

chrome.storage.local.get(["text"], (result) => {
  console.log(result);
})


const messageFromBackground = "Hello from the background script";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  console.log(sender);
  sendResponse(messageFromBackground);

  chrome.tabs.sendMessage(sender.tab.id, 
                          `${messageFromBackground} from chrome.tabs.sendMessage`,
                          (response) => {
                            console.log(response);
                          } 
                        );
})
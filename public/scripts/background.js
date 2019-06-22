chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "blockedCatArr") {
    console.log("categories:", request.categories);
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        // chrome.pageAction.show(tabs[0].id);
      }
    );
  }
});

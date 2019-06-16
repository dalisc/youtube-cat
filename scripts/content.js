// chrome.runtime.sendMessage({
//   todo: "showPageAction"
// });

chrome.runtime.onMessage.addListener(function(request, sender, response) {
  if (request.todo == "changePreferences") {
    const categoriesArr = request.categories;
    chrome.runtime.sendMessage({
      todo: "blockedCatArr",
      categories: categoriesArr
    });
  }
});

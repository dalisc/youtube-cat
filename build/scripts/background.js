var vidID;
var catName;
var blockedCategories = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "blockedCatArr") {
    console.log("categories:", request.categories);
    blockedCategories = request.categories;
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        // chrome.pageAction.show(tabs[0].id);
      }
    );
  } else if (request.todo == "receiveVidID") {
    vidID = request.vidID;
    console.log("background received vidID " + vidID);
  }
});

var myURL = "about:blank"; // A default url just in case below code doesn't work

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // onUpdated should fire when the selected tab is changed or a link is clicked
  chrome.tabs.getSelected(null, function(tab) {
    myURL = tab.url;
  });
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "getVidID" }, function(
      response
    ) {
      if (response != undefined) {
        console.log(response.vidID);
        getCatID(response.vidID);
      }
    });
  });

  // retrieve category ID
  function getCatID(vidID) {
    var fetchURL =
      "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" +
      vidID +
      "&key=AIzaSyAlWxetC3fiBRo64AXlbWsgBZ8ZRjHewhI";

    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.items["0"].snippet.categoryId); //success!
        var catID = data.items["0"].snippet.categoryId;
        var fetchCatURL =
          "https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&id=" +
          catID +
          "&key=AIzaSyAlWxetC3fiBRo64AXlbWsgBZ8ZRjHewhI";
        getCatName(fetchCatURL); // then retrieve category name
      })
      .catch(err => {
        console.log(err);
      });

    // retrieve category name
    function getCatName(fetchCatURL) {
      fetch(fetchCatURL, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.items["0"].snippet.title);
          catName = data.items["0"].snippet.title;
          for (let i = 0; i < blockedCategories.length; i++) {
            if (catName === blockedCategories[i]) {
              console.log("block condition");
              chrome.tabs.query({ active: true, currentWindow: true }, function(
                tabs
              ) {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { todo: "blockVideo" },
                  function(response) {
                    if (response != undefined) {
                      console.log(response.done);
                    }
                  }
                );
              });
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});

function sendMessage(port) {
  port.postMessage({ type: "reloadPage" });
}

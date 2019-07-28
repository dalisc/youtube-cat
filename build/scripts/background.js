var blockedCategories = [];
var blocked = 0;
var userForcedRefresh = false;
var stateChanged = false;
var searchURL = "";

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    if (request.todo == "blockedCatArr") {
        response({ feedback: "store blocked" });
        console.log("categories:", request.categories);
        blockedCategories = request.categories;
        chrome.tabs.query({
                active: true,
                currentWindow: true
            },
            function(tabs) {
                // chrome.pageAction.show(tabs[0].id);
            }
        );
    } else if (request.userAction == "forcedRefresh") {
        getCatID(request.vidID);
        userForcedRefresh = true;
        response({ feedback: "redoing block" });
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log("history changed");
    userForcedRefresh = false;

    if (!stateChanged) {
        stateChanged = true;
        console.log("set stateCHanged to true");
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { todo: "getVidID" }, function(
                response
            ) {
                if (response != undefined) {
                    console.log("vidID response is not undefined");
                    this.searchURL = response.searchURL;
                    console.log(response.vidID);
                    getCatID(response.vidID);
                } else {
                    stateChanged = false;
                }
            });
        });
    }
});

// retrieve category ID
function getCatID(vidID) {
    if (vidID) {
        console.log("in getCatID function");
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
    } else {
        stateChanged = false;
        console.log("set stateChanged to false");
    }
}
// retrieve category name
function getCatName(fetchCatURL) {
    var message;

    console.log("in function getCatName");
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
            var toBlock = false;
            for (let i = 0; i < blockedCategories.length; i++) {
                if (catName === blockedCategories[i]) {
                    toBlock = true;
                    break;
                }
            }

            if (toBlock || (userForcedRefresh && blocked > 0)) {
                console.log("block condition");
                // sends message to all open tabs
                // in case the user opens a to-be-blocked video in a new tab
                chrome.tabs.query({}, function(tabs) {
                    blocked++;
                    console.log(blocked);
                    if (blocked > 3) {
                        blocked = 0;
                        console.log("blocked thrice");
                        message = { todo: "redirect", searchURL: this.searchURL };
                    } else {
                        message = { todo: "blockVideo" };
                    }
                    chrome.tabs.query({}, function(tabs) {
                        for (var i = 0; i < tabs.length; i++) {
                            console.log('muting');
                            chrome.tabs.update(tabs.id, { "muted": true });
                            chrome.tabs.sendMessage(tabs[i].id, message, function(
                                response
                            ) {
                                if (response != undefined) {
                                    console.log(response.done);
                                }
                            });
                        }
                    });

                });
            } else {
                if (!userForcedRefresh) {
                    console.log("refreshing page to unblock wanted vid");
                    blocked = 0; // restart block count
                    chrome.tabs.query({ active: true, currentWindow: true }, function(
                        tabs
                    ) {
                        console.log('unmuting');
                        chrome.tabs.update(tabs[0].id, { "muted": false });
                        chrome.tabs.sendMessage(
                            tabs[0].id, { todo: "refreshPageToUnblockVid" },
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

    stateChanged = false;
    console.log("set stateChanged to false");
}
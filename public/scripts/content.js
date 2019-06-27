var vidID = youtube_parser(window.location.href);

chrome.runtime.sendMessage({
        userAction: "forcedRefresh",
        vidID: vidID
    },
    function(response) {
        console.log(reponse.feedback);
    });

const port = chrome.runtime.connect();

port.onMessage.addListener(msg => {
    switch (msg.type) {
        case "reloadPage":
            {
                console.log("received message");
                document.location.reload();
            }
        default:
            break;
    }
});

// detect video ID
function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    if (request.todo == "changePreferences") {
        const categoriesArr = request.categories;
        console.log("categoriesArr: ", categoriesArr);
        chrome.runtime.sendMessage({
            todo: "blockedCatArr",
            categories: categoriesArr
        });
    } else if (request.todo == "getVidID") {
        console.log("content received message");
        var vidID = youtube_parser(window.location.href);
        response({ vidID: vidID });
        console.log("content sent back vidID");
    } else if (request.todo == "blockVideo") {
        blockVideo();
        response({ done: "done" });
    } else if (request.todo == "refreshPageToUnblockVid") {
        response({ done: "page will reload" });
        window.location.reload();

    }
});


function blockVideo() {
    var vidDiv = document.getElementById("movie_player");
    vidDiv.innerHTML = '';
}
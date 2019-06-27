// chrome.runtime.sendMessage({
//   todo: "showPageAction"
// });

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
    }
});

function timeoutVidSrc(vid) {
    vid.src = "";
}

function blockVideo() {
    var vid = document.getElementsByTagName("video");
    console.log("video detected: ", vid);

    if (vid.length > 0) {
        console.log("replacing url");
        for (var i = 0, l = vid.length; i < l; i++) {
            console.log(vid[i].src);
            vid[i].src = "";
            console.log(vid[i].src);
            setTimeout(timeoutVidSrc(vid[i]), 1000);
        }

        setTimeout(function() {
            var vid = document.getElementsByTagName("video");

            console.log("first timeout function");

            if (vid.length > 0) {
                for (var i = 0, l = vid.length; i < l; i++) {
                    console.log(vid[i].src);
                    vid[i].src = "";
                    console.log(vid[i].src);
                }
            }
        }, 10);
    }
}
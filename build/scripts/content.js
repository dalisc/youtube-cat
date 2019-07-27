var vidID = youtube_parser(window.location.href);
// Reload page on extension update/uninstall
// port.onDisconnect.addListener(() => document.location.reload());
localStorage.clear();

chrome.runtime.sendMessage({
        userAction: "forcedRefresh",
        vidID: vidID
    },
    function(response) {
        console.log(response.feedback);
    }
);

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
    var searchExp = /https:\/\/www\.youtube\.com\/results\?search_query=(.*)/;
    var match = url.match(regExp);
    var searched = url.match(searchExp);
    if (searched) {
        localStorage.setItem("search", url);
    }
    console.log("hi");
    return match && match[7].length == 11 ? match[7] : false;
}

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    // receiving message from firebase
    if (request.todo == "changePreferences") {
        const categoriesArr = request.categories;
        console.log("categoriesArr: ", categoriesArr);
        // sending message to background script
        chrome.runtime.sendMessage({
            todo: "blockedCatArr",
            categories: categoriesArr
        });
        response({ message: "done changed preference" });
    } else if (request.todo == "receivePurpose") {
        var purpose = request.purpose;
        localStorage.setItem("purpose", purpose);
        console.log("receiving purpose");
        response({ message: "done receive purpose" });
    } else if (request.todo == "getVidID") {
        console.log("content received message");
        var vidID = youtube_parser(window.location.href);
        response({ vidID: vidID });
        console.log("content sent back vidID");
    } else if (request.todo == "blockVideo") {
        var evt = new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 });
        document.dispatchEvent(evt);
        console.log("blocking video after user forced refresh");
        blockVideo();
        response({ done: "done" });
    } else if (request.todo == "redirect") {
        response({ done: "redirecting" });
        var url = localStorage.getItem("search");
        var purpose = localStorage.getItem("purpose");
        console.log(purpose)
        if (url == null) {
            window.location.href = "https://www.youtube.com";
            console.log("redirected to main page");
        } else {
            window.location.href = url;
            console.log("redirected to search results")
        }

        if (purpose != null) {
            console.log("displaying purpose")
            alert("Remember, your purpose today is:" + purpose);
        }

    } else if (request.todo == "refreshPageToUnblockVid") {
        response({ done: "page will reload" });
        window.location.reload();
    }
});

function blockVideo() {
    // var vid = document.getElementsByTagName("body")
    // console.log(vid[0])
    // vid.innerHTML = ""
    var div1 = document.getElementById("movie_player");
    if (div1 != null) {
        div1.innerHTML = "";
    }
    var image = document.createElement("img");
    image.setAttribute("src", "https://i.ibb.co/kDKq8SK/1.png");
    image.setAttribute("alt", "video is blocked");

    if (div1 != null) {
        div1.appendChild(image);
    }
    var div6 = document.getElementById("player-container-outer");
    var div7 = document.getElementById("meta"); // channel description page
    var div8 = document.getElementById("comments");
    var div9 = document.getElementById("menu-container");
    div6.innerHTML = "";
    div7.innerHTML = "";
    div8.innerHTML = "";
    div9.innerHTML = "";
    div6.appendChild(image);
    console.log("emptied out all divs");
    var e = new KeyboardEvent('keydown', { 'keyCode': 32, 'which': 32 });
    document.dispatchEvent(e);

}
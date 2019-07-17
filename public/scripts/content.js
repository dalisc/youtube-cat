var vidID = youtube_parser(window.location.href);
// Reload page on extension update/uninstall
// port.onDisconnect.addListener(() => document.location.reload());

chrome.runtime.sendMessage({
        userAction: "forcedRefresh",
        vidID: vidID
    },
    function(response) {
        console.log(response.feedback);
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
    var searchExp = /https:\/\/www\.youtube\.com\/results\?search_query=/;
    var match = url.match(regExp);
    var searched = url.match(searchExp);
    if (searched) {
        localStorage.setItem('search', url)
    } else {
        localStorage.setItem('search', '')
    }
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
    } else if (request.todo == "receivePurpose") {
        var purpose = request.purpose;
        localStorage.setItem('purpose', purpose)
    } else if (request.todo == "getVidID") {
        console.log("content received message");
        var vidID = youtube_parser(window.location.href);
        response({ vidID: vidID });
        console.log("content sent back vidID");
    } else if (request.todo == "blockVideo") {
        blockVideo();
        response({ done: "done" });
    } else if (request.todo == "redirect") {
        response({ done: "redirected to main page" });
        var url = localStorage.getItem('search')
        var purpose = localStorage.getItem('purpose')
        if (url = '') {
            window.location.href = "https://www.youtube.com";
        } else {
            window.location.href = url;
            if (purpose) {
                alert("Remember, your purpose today is:" + purpose);
            }
        }

    } else if (request.todo == "refreshPageToUnblockVid") {
        response({ done: "page will reload" });
        window.location.reload();

    }
});


function blockVideo() {
    var div1 = document.getElementById("movie_player");
    var div3 = document.getElementById("player-container-outer");
    var div4 = document.getElementById("player-container-inner");
    var div5 = document.getElementById("player-container");
    var div6 = document.getElementById("ytd-player");
    var div7 = document.getElementById("meta"); // channel description page
    var div8 = document.getElementById("comments");
    var div9 = document.getElementById("menu-container");

    //div0.innerHTML = '';
    //div1.innerHTML = '';
    //div2.innerHTML = '';
    div3.innerHTML = '';
    //div4.innerHTML = '';
    //div5.innerHTML = '';
    //div6.innerHTML = '';
    div7.innerHTML = '';
    div8.innerHTML = '';
    div9.innerHTML = '';
    var node = document.createElement("h1");
    var textnode = document.createTextNode("SORRY, YOU CAN'T WATCH THIS VIDEO.");
    node.appendChild(textnode);
    div3.appendChild(node);

    var image = document.createElement("img");
    image.setAttribute('src', 'http://placekitten.com/200/300');
    image.setAttribute('alt', 'video is blocked');
    div3.appendChild(image);

    console.log(div1, div2, div3, div4, div5, div6);
}

var thumbnailsByID = document.getElementById('thumbnail');
console.log(thumbnailsByID)
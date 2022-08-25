const wlnAPI = "https://www.wlnupdates.com/api";

async function searchNovel(novelTitle){
    const Data = {
        "title" : novelTitle,
        "mode" : "search-title"
    };

    const params = {
        headers : new Headers({
            "content-type" : "application/json; charset=UTF-8"
        }),
        body : JSON.stringify(Data),
        method : "POST"
    };

    try{
        const results = document.getElementById("search-results");
        results.innerHTML = "";

        const response = await fetch(wlnAPI, params)
        .then(res=>res.json())
        .catch(error=>console.log("Error: ", error.message || "Some error occured"));
        
        chrome.runtime.sendMessage({msg: 'Get Tracked Novels'}, async function(items){
            for(const element of response.data.results)
            {
                const result = document.createElement("div");
                result.className = "search-element";
                result.innerHTML = "<div id = \""+ element.sid + "\">" + element.match[0][1] + "</div>"
                                + "<button id=\"Detail" + element.sid + "\"> Details </button>";
                if(element.sid in items)
                {
                    result.innerHTML += "<button id=\"Untrack" + element.sid + "\"> Untrack </button>";
                    results.appendChild(result);
                    document.getElementById("Untrack" + element.sid).addEventListener('click', function(sid){
                        return function(){
                            untrackNovel(sid);
                        }
                    } (element.sid));
                }
                else
                {
                    result.innerHTML += "<button id=\"Track" + element.sid + "\"> Track </button>";
                    results.appendChild(result);
                    document.getElementById("Track" + element.sid).addEventListener('click', function(sid){
                        return function(){
                            trackNovel(sid);
                        }
                    } (element.sid));
                }

                document.getElementById("Detail" + element.sid).addEventListener('click', function(sid){
                    return function(){
                        getNovelDetails(sid);
                    }
                } (element.sid));
            }
        });
    }
    catch(e){
        console.log("Error: ", e);
    }
}

//searchNovel("The book eating magician");

async function getNovelDetails(sid){
    console.log("Get details for id: ", sid);

    const Data = {
        "id" : sid,
        "mode" : "get-series-id"
    };

    const params = {
        headers : new Headers({
            "content-type" : "application/json; charset=UTF-8"
        }),
        body : JSON.stringify(Data),
        method : "POST"
    };

    try{

        const response = await fetch(wlnAPI, params)
        .then(res=>res.json())
        .catch(error=>console.log("Error: ", error.message || "Some error occured"));

        const panel = document.getElementById("details-panel");
        
        panel.innerHTML = "<p class=\'novel-title\'> Title: " + response.data.title + "</p>" +
            "<p class=\'details-label\'> Alternate names: </p>";
        for(const altTitle of response.data.alternatenames)
        {
            panel.innerHTML += "<p class=\'details-item\'>" + altTitle + "</p>";
        }
        if(response.data.authors.length > 1)
            panel.innerHTML += "<p class=\'details-label\'> Authors: </p>";
        else
            panel.innerHTML +=  "<p class=\'details-label\'> Author: </p>";
        for(const auth of response.data.authors)
        {
            panel.innerHTML += "<p class=\'details-item\'>" + auth.author + "</p>";
        }
        panel.innerHTML += "<p class=\'details-label\'> Description: </p>"
            + (response.data.description || "no description provided")
            + "<p class=\'details-label\'> Status: </p>"
            + "<p class=\'details-item\'>" + (response.data.orig_status || "no status provided") + "</p>";
    }
    catch(e){
        console.log("Error: ", e);
    }
}

function trackNovel(sid){
    try{
        chrome.storage.sync.get("trackedIds", async function(items){
            if(items.trackedIds["" + sid]!=undefined)
            {
                console.log("Already being tracked");
                return;
            }
            items.trackedIds["" + sid] = {
                title: "",
                lastPub: "",
                status: ""
            };
            chrome.storage.sync.set({"trackedIds" : items.trackedIds}, async function(){
                console.log("Added to tracked ", "" + sid);
            });
        });
    }
    catch(e){
        console.error("Error: ", e);
    }
}

function untrackNovel(sid){
    try{
            chrome.storage.sync.get("trackedIds", async function(items){
            if(items.trackedIds["" + sid]==undefined)
            {
                console.log("Novel not being tracked");
                return;
            }
            items.trackedIds["" + sid] = undefined;
            chrome.storage.sync.set({"trackedIds" : items.trackedIds}, async function(){
                console.log("Removed from tracked ", "" + sid);
            });
        });
    }
    catch(e){
        console.error("Error: ", e);
    }
}

document.getElementById("query").addEventListener("click", async function(){
    const novelTitle = document.getElementById("query-string").value;
    console.log("Searching for: ", novelTitle);
    searchNovel(novelTitle);
});


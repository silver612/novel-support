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

        const x = await fetch(wlnAPI, params)
        .then(res=>res.json())
        .catch(error=>console.log("Error: ", error.message || "Some error occured"));
        
        for(const element of x.data.results)
        {
            const result = document.createElement("div");
            result.innerHTML = "<div id = \""+ element.sid + "\">" + element.match[0][1] + "</div>"
                            + "<button id=\"Track" + element.sid + "\"> Details </button>"
                            + "<button id=\"Detail" + element.sid + "\"> Track </button>";
            results.appendChild(result);
            document.getElementById("Track" + element.sid).addEventListener('click', function(sid){
                return function(){
                    getNovelDetails(sid);
                }
            } (element.sid));
            document.getElementById("Detail" + element.sid).addEventListener('click', function(sid){
                return function(){
                    trackNovel(sid);
                }
            }(element.sid));
        }
    }
    catch(e){
        console.log("Error: ", e);
    }
}

//searchNovel("The book eating magician");

function getNovelDetails(sid){
    console.log("Get details for id: ", sid);
}

function trackNovel(sid){
    console.log("Add to tracked: ", sid);
}

document.getElementById("query").addEventListener("click", async function(){
    const novelTitle = document.getElementById("query-string").value;
    console.log("Searching for: ", novelTitle);
    searchNovel(novelTitle);
});


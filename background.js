// run code in the background
const wlnAPI = "https://www.wlnupdates.com/api";

chrome.runtime.onInstalled.addListener(async function(){
    chrome.storage.sync.set({"trackedIds" : new Object()}, function(){
        console.log("First time tracked ids value set");
    })
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "Get Tracked Novels"){
            try{
                chrome.storage.sync.get("trackedIds", async function(items){
                    console.log(items.trackedIds, typeof(items.trackedIds));
                    var infoArr = new Object();
                    for(const element in items.trackedIds)
                    {
                        if(items.trackedIds[element]==undefined)
                            continue;
                        const Data = {
                            "id" : element,
                            "mode" : "get-series-id"
                        };
                        const params = {
                            headers : new Headers({
                                "content-type" : "application/json; charset=UTF-8"
                            }),
                            body : JSON.stringify(Data),
                            method : "POST"
                        };
                        const response = await fetch(wlnAPI, params)
                            .then(res=>res.json())
                            .catch(error=>console.log("Error: ", error.message || "Some error occured"));
                        
                        var info;
                        if(!(items.trackedIds[element].title=="" || items.trackedIds[element].lastPub != response.data.latest_published))
                            info = items.trackedIds[element];
                        else{
                            var info = {
                                title: response.data.title,
                                lastPub: response.data.latest_published,
                                status : 'New'
                            };
                        }
                        infoArr[element] = info;
                    }
                    chrome.storage.sync.set({"trackedIds": infoArr});
                    sendResponse(infoArr);
                });
            }
            catch(e){
                console.log("Error: ", e);
            }
        }
        else if(request.msg == 'Update status'){
            try{
                chrome.storage.sync.get("trackedIds", async function(items){
                    for(const element in request.data){
                        console.log("Updating status for: ", request.data[element], items.trackedIds);
                        items.trackedIds[element].status = 'Old';
                    }
                    chrome.storage.sync.set({"trackedIds" : items.trackedIds});
                });
            }
            catch(e){
                console.log("Error: ", e);
            }
        }
        return true;
    }
);